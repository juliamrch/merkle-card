const path = require('path')
const dotenv = require('dotenv')
const envPath = path.resolve(__dirname, '..', '.env')
dotenv.config({ path: envPath })

const REACT_APP_ONEINCH_KEY = process.env.REACT_APP_ONEINCH_API_KEY

const chains = require('./chains.json')
const axios = require("axios");
const { cardsDB, portfoliosDB, tokensDB } = require('./mongodb')

async function getWalletTokensInfoRaw(wallet) {
    const url = "https://api.1inch.dev/portfolio/portfolio/v4/overview/erc20/details";

    const config = {
        headers: {
            "Authorization": `Bearer ${REACT_APP_ONEINCH_KEY}`
        },
        params: {
            "addresses": wallet,
            "timerange": "3years"
        }
    };

    try {
        const response = await axios.get(url, config);
        // console.log(response.data);
        return response.data
    } catch (error) {
        console.error(error);
    }

    return null
}

async function getJpegsInfo(wallet) {
    const url = "https://api.1inch.dev/nft/v1/byaddress";

    const config = {
        headers: {
            "Authorization": `Bearer ${REACT_APP_ONEINCH_KEY}`
        },
        params: {
            "chainIds": "1,45,137,10,56,42161,43114,100,250,1313161554,8217,324,8453",
            "address": wallet
        }
    };

    try {
        const response = await axios.get(url, config);
        // console.log(response.data);
        return response.data
    } catch (error) {
        console.error(error);
    }
}

async function getBalances() {
    const url = "https://api.1inch.dev/balance/v1.2/1/balances/0x0";

    const config = {
        headers: {
            "Authorization": `Bearer ${REACT_APP_ONEINCH_KEY}`
        },
        params: {}
    };


    try {
        const response = await axios.get(url, config);

        const tokens = Object.keys(response.data)
        for (let i = 0, cnt = tokens.length; i < cnt; ++i) {
            const token = tokens[i]
            const balance = response.data[token]

            if (balance === '0') {
                continue
            }

            console.log(token, balance)
        }
    } catch (error) {
        console.error(error);
    }
}

async function getSpotPrices() {

    const url = "https://api.1inch.dev/price/v1.1/1/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee,0x78a0a62fba6fb21a83fe8a3433d44c73a4017a6f,0x3b50805453023a91a8bf641e279401a0b23fa6f9";

    const config = {
        headers: {
            "Authorization": `Bearer ${REACT_APP_ONEINCH_KEY}`
        },
        params: {
            "currency": "USD"
        }
    };


    try {
        const response = await axios.get(url, config);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

async function getTokensInfo(chainId, tokens) {
    const url = `https://api.1inch.dev/token/v1.2/${chainId}/custom`;

    const config = {
        headers: {
            "Authorization": `Bearer ${REACT_APP_ONEINCH_KEY}`
        },
        params: {
            "addresses": tokens.join(',')
        }
    };

    try {
        const response = await axios.get(url, config);
        // console.log(response.data);

        return response.data
    } catch (error) {
        console.error(error);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWalletTokensInfo(walletAddress) {
    const data = await getWalletTokensInfoRaw(walletAddress)
    const walletData = data.result

    await sleep(1000)

    const customTokensIds = await crawlTokensIfNeeded(walletData)
    const { knownTokensObj } = await getKnownTokens(customTokensIds)
    const tokens = []

    for (let i = 0, cnt = walletData.length; i < cnt; ++i) {
        const tokenInfo = walletData[i]
        const customTokenId = tokenInfo.chain_id + tokenInfo.contract_address
        const tokenRaw = knownTokensObj[customTokenId]

        tokenInfo.token = tokenRaw

        tokens.push({
            chain: { chainId: tokenInfo.chain_id, name: chains[tokenInfo.chain_id] },
            image: tokenRaw.logoURI,
            name: `${tokenRaw.symbol} (${tokenRaw.name})`,
            amount: tokenInfo.amount,
            value: tokenInfo.value_usd,
            abs_profit_usd: tokenInfo.abs_profit_usd,
        })
    }

    const nftsRaw = await getJpegsInfo(walletAddress)
    const nfts = []

    for (let i = 0, cnt = nftsRaw.assets.length; i < cnt; ++i) {
        const nft = nftsRaw.assets[i]

        if (!nft.image_thumbnail_url || !nft.name || !nft.permalink) {
            continue
        }

        nfts.push({ chain: { chainId: nft.chainId, name: chains[nft.chainId] }, image: nft.image_thumbnail_url, name: nft.name, link: nft.permalink })
    }

    const result = await portfoliosDB.updateOne({ walletAddress }, {
        $set: {
            tokens,
            tokensRaw: walletData,
            nfts,
            nftsRaw,
            lastUpdateTime: Date.now(),
        }
    }, { upsert: true });

    console.log(`${result.matchedCount} getWalletTokensInfo document(s) matched the filter criteria.`);
    console.log(`${result.modifiedCount} getWalletTokensInfo document(s) was/were updated.`);
    console.log(`${result.upsertedCount} getWalletTokensInfo document(s) was/were inserted.`);

    return { tokens, nfts }
}

async function getKnownTokens(customTokensIds) {
    const knownTokens = await tokensDB.find({ customTokenId: { $in: Object.keys(customTokensIds) } }).toArray()
    const knownTokensObj = knownTokens.reduce((all, v) => {
        all[v.chainId.toString() + v.address] = v

        return all
    }, {})

    return { knownTokens, knownTokensObj }
}

async function crawlTokensIfNeeded(walletData) {
    const customTokensIds = {}

    for (let i = 0, cnt = walletData.length; i < cnt; ++i) {
        const tokenInfo = walletData[i]

        customTokensIds[tokenInfo.chain_id + tokenInfo.contract_address] = { chainId: tokenInfo.chain_id, token: tokenInfo.contract_address }
    }

    const { knownTokensObj } = await getKnownTokens(customTokensIds)
    const crawlTokensObj = {}
    const customTokensIdsList = Object.keys(customTokensIds)

    for (let i = 0, cnt = customTokensIdsList.length; i < cnt; ++i) {
        const id = customTokensIdsList[i]
        const chainId = customTokensIds[id].chainId
        const token = customTokensIds[id].token

        if (!knownTokensObj[chainId + token]) {
            if (!crawlTokensObj[chainId]) {
                crawlTokensObj[chainId] = []
            }

            crawlTokensObj[chainId].push(token)
        }
    }

    const crawlTokens = Object.keys(crawlTokensObj)
    if (crawlTokens.length !== 0) {
        await crawlUnknownTokens(crawlTokensObj)
    }

    return customTokensIds
}

async function crawlUnknownTokens(crawlTokensObj) {
    let allTokens = []
    const chainIds = Object.keys(crawlTokensObj)

    for (let i = 0, cnt = chainIds.length; i < cnt; ++i) {
        const chainId = chainIds[i]
        const tokensList = crawlTokensObj[chainId]

        const tokensInfo = await getTokensInfo(chainId, tokensList)
        const tokens = Object.keys(tokensInfo).reduce((all, v) => {
            const token = tokensInfo[v]

            token.customTokenId = token.chainId + token.address

            all.push(token)

            return all
        }, [])

        allTokens = allTokens.concat(tokens)

        await sleep(1000)
    }

    if (allTokens.length !== 0) {
        const bulkOps = allTokens.map(doc => ({
            updateOne: {
                filter: { customTokenId: doc.customTokenId },
                update: { $set: doc },
                upsert: true
            }
        }));

        const result = await tokensDB.bulkWrite(bulkOps);
        console.log(`${result.matchedCount} crawlUnknownTokens document(s) matched the filter criteria.`);
        console.log(`${result.modifiedCount} crawlUnknownTokens document(s) was/were updated.`);
        console.log(`${result.upsertedCount} crawlUnknownTokens document(s) was/were inserted.`);
    }
}

async function updateCards() {
    const oneMinuteAgo = Date.now() - 60000

    const cursor = cardsDB.find({
        lastUpdated: { $lt: oneMinuteAgo }
    }).sort({ lastUpdated: 1 })

    const results = await cursor.toArray();

    for (let i = 0, cnt = results.length; i < cnt; ++i) {
        const card = results[i]
        const cardFilter = { _id: card._id }

        await cardsDB.updateOne(cardFilter, { $set: { status: 'UPDATING' } })
        console.log('updating card', card.name)

        let allTokens = []
        let allNfts = []

        for (let j = 0, cntj = card.wallets.length; j < cntj; ++j) {
            const wallet = card.wallets[j]

            console.log('updating wallet', wallet)

            const { tokens, nfts } = await getWalletTokensInfo(wallet)

            allTokens = allTokens.concat(tokens)
            allNfts = allNfts.concat(nfts)
        }

        const totalValue = allTokens.reduce((all, v) => all + v.value, 0)
        const totalPnl = allTokens.reduce((all, v) => all + v.abs_profit_usd, 0)

        await cardsDB.updateOne(cardFilter, { $set: { tokens: allTokens, nfts: allNfts, totalValue, totalPnl, status: 'FINISHED', lastUpdated: Date.now() } })

        await sleep(1000)
    }
}

async function main() {
    // await cardsDB.insertOne({
    //     id: 'fkdsjfsdjfsdjfk',
    //     name: 'milady',
    //     wallets: ['0x0'],
    // })
    // await getWalletTokensInfo('0x0')
    // await getTokensInfo(137, ['0x7ceb23fd6bc0add59e62ac25578270cff1b9f619'])
    // await sleep(1000)
    // console.log(await getJpegsInfo('0x0'))
    // await getBalances()

    while (true) {
        await updateCards()

        await sleep(1000 * 2)
    }

    process.exit(0)
}

main()
