import Card from "./components/Card";
import { UserInputWrap, Input, Textarea, Label, Button, ThemesWrap, SelectTheme } from './styled/UserInputSection';
import { HeadingStyled } from './styled/Headings';
import Footer from './components/Footer';
import { useEffect, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import download from 'downloadjs';
import img_location from './assets/mikoto-urabe.jpg';
import LoginButton from './components/Login';
import Modal from './components/Modal';
import Gallery from './components/Gallery';
import LoadingSpinner from './components/Spinner';
import WalletsList from './components/WalletsList';
import { usePrivy,useWallets } from '@privy-io/react-auth';
//import CardForm from './components/CardForm';

function App() {
  const { user, ready, authenticated, getAccessToken } = usePrivy();
  const [userData, setUserData] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(img_location);
  const [isImageModified, setIsImageModified] = useState({
    status: false,
    fileType: "",
    target: {}
  });
  const [cards, setCards] = useState([]);
  const [downloadState, setDownloadState] = useState(false);
  const [downloadable, setDownloadable] = useState(false);
  const [inputs, setInputs] = useState({
    name: undefined,
    occupation: undefined,
    website: undefined,
    email: undefined,
    about: undefined,
    services: undefined
  });
  const [breakpoint, setBreakpoint] = useState(Math.round(window.document.body.clientWidth / 16));
  const [colors, setColors] = useState({
    cardBackgroundColor: "#1A1B21",
    nameColor: "#FFFFFF",
    occupationColor: "#F3BF99",
    websiteColor: "#767676",
    aboutInterestsTitleColor: "#F5F5F5",
    descColor: "#9a9a9a",
    emailColor: "#918E9B",
    emailBackgroundColor: "#161619"
  });
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUserData = async () => {
    if (!authenticated) {
      console.log('User not authenticated');
      return;
    }
    
    try {
      const token = await getAccessToken();
      const response = await fetch('http://localhost:8080/api/user/logged', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      const secondaryWallets = data.user.wallet?.address;
      const formattedNFTs = !data.cards || data.cards.length === 0 || !data.cards[0].nfts ? [] : data.cards[0].nfts.map(asset => ({
        id: '',
        name: asset.name,
        description: '',
        imageUrl: asset.image,
        permalink: asset.link
      }));
      setNfts(formattedNFTs); setLoading(false)
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchUserData();
    }
  }, [authenticated]);

  const handleSelectNFT = (nft) => {
    setSelectedNFT(nft);
    setShowModal(false);
  };

  useEffect(() => {
    if (isImageModified.status) {
      if (isImageModified.fileType === "image") {
        if (document.querySelector("#image") !== null) {
          if (document.querySelector("#image").files.length === 1) {
            setImage(URL.createObjectURL(new Blob([isImageModified.target.files[0]], { type: "image" })));
            document.querySelector("#upload_label").innerHTML = "Uploaded Successfully!";
            document.querySelector("#upload_label").classList.remove("focus");
            setTimeout(() => {
              document.querySelector("#upload_label").innerHTML = "Upload new pic";
            }, 2500);
          }
        }
      } else {
        document.querySelector("#upload_label").innerHTML = "Please upload an image file";
        document.querySelector("#upload_label").classList.add("focus");
        document.querySelector(".main-heading").scrollIntoView(true, { behavior: "smooth" });
      }
    }
  }, [isImageModified]);

  function inputChange(e, index) {
    setInputs(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  function input_check() {
    let filled = {
      inputs: false,
      textarea: false,
      image: false
    };

    let all_input_fields = document.querySelectorAll("input");
    let textareas = document.querySelectorAll("textarea");

    for (let index = 0; index < all_input_fields.length; index++) {
      if (index === 0) {
        if (all_input_fields[index].files.length !== 0) {
          filled.image = true;
        }
      } else {
        if (all_input_fields[index].value === undefined || all_input_fields[index].value === "") {
          filled.inputs = false;
          break;
        } else if (all_input_fields[index].value !== undefined || all_input_fields[index].value !== "") {
          filled.inputs = true;
        }
      }
    }

    for (let index = 0; index < textareas.length; index++) {
      if (textareas[index].value === "") {
        filled.textarea = false;
        break;
      } else if (textareas[index].value !== "") {
        filled.textarea = true;
      }
    }

    (filled.textarea && filled.inputs) ? setDownloadable(true) : setDownloadable(false);
  }

  function colorChange(e) {
    function borderChange(element) {
      element.style.borderColor = "#000000"; //#ffb681
      let all_color_selectors = element.parentElement.childNodes;
      all_color_selectors.forEach((item) => {
        if (item.localName !== "p") {
          if (item !== element) {
            item.style.borderColor = "transparent";
          }
        }
      });
    }
    if (e.target.style.backgroundColor === "rgb(88, 44, 77)") {
      borderChange(e.target);
      setColors({
        cardBackgroundColor: "#582C4D",
        nameColor: "#ECE2D0",
        occupationColor: "#F3BF99",
        websiteColor: "#BFB5AF",
        aboutInterestsTitleColor: "#ECE2D0",
        descColor: "#D6CCC0",
        emailColor: "#BFB5AF",
        emailBackgroundColor: "#6B3B54"
      });
    } else if (e.target.style.backgroundColor === "black") {
      borderChange(e.target);
      setColors({
        cardBackgroundColor: "#1A1B21",
        nameColor: "#FFFFFF",
        occupationColor: "#F3BF99",
        websiteColor: "#767676",
        aboutInterestsTitleColor: "#F5F5F5",
        descColor: "#9a9a9a",
        emailColor: "#918E9B",
        emailBackgroundColor: "#161619"
      });
    } else if (e.target.style.backgroundColor === "white") {
      borderChange(e.target);
      setColors({
        cardBackgroundColor: "#F5F5F5",
        nameColor: "#000000",
        occupationColor: "#d46c1f",
        websiteColor: "#767676",
        aboutInterestsTitleColor: "#252525",
        descColor: "#7e7e7e",
        emailColor: "#747474",
        emailBackgroundColor: "#D5D4D8"
      });
    } else if (e.target.style.backgroundColor === "rgb(61, 90, 128)") {
      borderChange(e.target);
      setColors({
        cardBackgroundColor: "#3D5A80",
        nameColor: "#E0FBFC",
        occupationColor: "#E7B4A5",
        websiteColor: "#98C1D9",
        aboutInterestsTitleColor: "#E0FBFC",
        descColor: "#98C1D9",
        emailColor: "#98C1D9",
        emailBackgroundColor: "#385071"
      });
    } else if (e.target.style.backgroundColor === "rgb(244, 232, 193)") {
      borderChange(e.target);
      setColors({
        cardBackgroundColor: "#F4E8C1",
        nameColor: "#502419",
        occupationColor: "#2B4141",
        websiteColor: "#A2866D",
        aboutInterestsTitleColor: "#502419",
        descColor: "#795543",
        emailColor: "#502419",
        emailBackgroundColor: "#E0D0AC"
      });
    } else if (e.target.style.backgroundColor === "rgb(238, 180, 179)") {
      borderChange(e.target);
      setColors({
        cardBackgroundColor: "#EEB4B3",
        nameColor: "#402350",
        occupationColor: "#784784",
        websiteColor: "#2F242C",
        aboutInterestsTitleColor: "#402350",
        descColor: "#784784",
        emailColor: "#402350",
        emailBackgroundColor: "#DBA2AC"
      });
    }
  }

  function download_image() {
    setDownloadState(true);
    htmlToImage.toPng(document.querySelector("#card"), {
      quality: 1.0
    }).then((dataUrl) => {
      download(dataUrl, 'business_card_image');

      setDownloadState(true);

      setTimeout(() => {
        setDownloadState(false);
      }, 1000);
    });
  }

  window.addEventListener('resize', () => {
    setBreakpoint(Math.round((window.document.body.clientWidth) / 16));
  });

  useEffect(() => {
    let url = new URL(window.location.href);
    let search = new URLSearchParams(url.searchParams);

    if (search.toString() === "") {
      fetch({
        method: 'post',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: 'direct'
      }).then((res) => {
        console.log(res);
        return res.json();
      }).then((data) => {
        console.log(data);
      }).catch((error) => {
        console.log(error);
      });
    } else {
      for (let i of search.entries()) {
        fetch({
          method: 'post',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: i[1]
        }).then((res) => {
          console.log(res);
          return res.json();
        }).then((data) => {
          console.log(data);
        }).catch((error) => {
          console.log(error);
        });
      }
    }
  }, []);

  function props_conf(field) {
    return inputs[field] === '' ? undefined : inputs[field];
  }

  const createNewCard = async (formData) => {
    if (!authenticated) {
      console.log('User not authenticated');
      return;
    }

    try {
      const token = await getAccessToken();
      const response = await fetch(`http://localhost:8080/api/card/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create new card');
      }

      const data = await response.json();
      const newCard = data.card;
      setCards(prevCards => [newCard, ...prevCards]); // Add the new card to the state at the top
    } catch (error) {
      console.error('Failed to create new card', error);
    }
  };

  return (
    <>
      <main id="main">
        <UserInputWrap>
          <HeadingStyled className="main-heading">Merkle Card Generator</HeadingStyled>
          <LoginButton className="login-button" />
          {ready && authenticated && (
            <>
              <button className="web3button" onClick={() => setShowModal(true)}>Choose Picture</button>
              <Modal show={showModal} handleClose={() => setShowModal(false)}>
                {loading ? <LoadingSpinner /> : <Gallery nfts={nfts} onSelect={handleSelectNFT} />}
              </Modal>
              {/* New Card Button */}
              <button className="web3button" onClick={() => createNewCard({ id: Date.now(), formData: {} })}>New Card</button>

              <Input type="file" accept="image/*" onChange={(e) => { setIsImageModified({ status: true, fileType: e.target.files[0].type.split("/")[0], target: e.target }); input_check(); }} id="image" placeholder="Upload an image" required />
              <Input type="text" name="name" onChange={(e) => { inputChange(e); input_check(); }} value={inputs.name || ""} id="name" placeholder="Your name?" required autoComplete="off" />
              <Input type="text" name="occupation" onChange={(e) => { inputChange(e); input_check(); }} value={inputs.occupation || ""} id="occupation" placeholder="Profession" required autoComplete="off" />
              <Input type="text" name="website" onChange={(e) => { inputChange(e); input_check(); }} value={inputs.website || ""} id="website" placeholder="Website" required autoComplete="off" />
              <Input type="email" name="email" onChange={(e) => { inputChange(e); input_check(); }} value={inputs.email || ""} id="email" placeholder="Email" required autoComplete="off" />
              <Textarea type="text" name="about" onChange={(e) => { inputChange(e); input_check(); }} value={inputs.about || ""} id="about" placeholder="A little bit about you.." rows="5" required autoComplete="off" />
              <Textarea type="text" name="services" onChange={(e) => { inputChange(e); input_check(); }} value={inputs.services || ""} id="interests" placeholder="Services offered..." rows="5" required autoComplete="off" />
              <ThemesWrap>
                <p>Theme </p>
                <SelectTheme onClick={(e) => { colorChange(e) }} style={{ backgroundColor: 'black' }} />
                <SelectTheme onClick={(e) => { colorChange(e) }} style={{ backgroundColor: 'white' }} />
                <SelectTheme onClick={(e) => { colorChange(e) }} style={{ backgroundColor: '#582C4D' }} />
                <SelectTheme onClick={(e) => { colorChange(e) }} style={{ backgroundColor: '#3D5A80' }} />
                <SelectTheme onClick={(e) => { colorChange(e) }} style={{ backgroundColor: '#F4E8C1' }} />
                <SelectTheme onClick={(e) => { colorChange(e) }} style={{ backgroundColor: '#EEB4B3' }} />
              </ThemesWrap>
              <Button className="for-desktop download_btn" disabled={downloadable ? false : true} title={downloadable ? "" : "Please fill out all fields"} onClick={() => { download_image() }}>Download<i className={downloadState ? "fas fa-circle-notch load" : "fas fa-download"}></i></Button>
            </>
          )}
        </UserInputWrap>
        <Card name={props_conf('name')} occupation={props_conf('occupation')} website={props_conf('website')} email={props_conf('email')} linkedin about={props_conf('about')} services={props_conf('services')} github twitter instagram colors={colors} download_fun={download_image} image_src={selectedNFT ? selectedNFT.imageUrl : image} download_state={downloadState} breakpoint={breakpoint} downloadable={downloadable} />
      </main>
      <Footer />
    </>
  );
};

export default App;

//  return (
{/*    <>
      <main id="main">

      <LoginButton className="login-button" />
        <UserInputWrap>
          <HeadingStyled className="main-heading">Merkle Card Generator</HeadingStyled>
          <LoginButton className="login-button" />
          {/*{ready && authenticated && (
            <>
              <button className="web3button" onClick={() => setShowModal(true)}>Choose Picture</button>
              <Modal show={showModal} handleClose={() => setShowModal(false)}>
                {loading ? <LoadingSpinner /> : <Gallery nfts={nfts} onSelect={handleSelectNFT} />}
              </Modal>
          

              {/* New Card Button
              <button className="web3button" onClick={() => setCards([{ id: Date.now(), formData: {} }, ...cards])}>New Card</button>

              {/* Render Card Forms
              {cards.map((card, index) => (
                <Card key={card.id} initialData={card.formData} onSubmit={createNewCard} />
              ))}
        {/*</UserInputWrap>
        
        {/* <Card name={props_conf('name')} occupation={props_conf('occupation')} website={props_conf('website')} email={props_conf('email')} linkedin about={props_conf('about')} services={props_conf('services')} github twitter instagram colors={colors} download_fun={download_image} image_src={selectedNFT ? selectedNFT.imageUrl : image} download_state={downloadState} breakpoint={breakpoint} downloadable={downloadable} />
      </main> 
      <Footer />
    </>
  );
}; */}

