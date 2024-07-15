import React, { useState } from 'react';
import Card from './Card';
import { UserInputWrap, Input, Textarea, Button } from '../styled/UserInputSection';
import Modal from './Modal';
import Gallery from './Gallery';
import LoadingSpinner from './Spinner';
import { usePrivy } from '@privy-io/react-auth';

const CardForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(initialData);
  const [showModal, setShowModal] = useState(false);
  const [nfts, setNfts] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [loading, setLoading] = useState(true);
  const { ready, authenticated } = usePrivy();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
};

const handleSelectNFT = (nft) => {
    setSelectedNFT(nft);
    setShowModal(false);
};

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

  return (
    <>
      {ready && authenticated && (
        <form onSubmit={handleSubmit}>
          <UserInputWrap>
            <button className="web3button" type="button" onClick={() => setShowModal(true)}>Choose Picture</button>
            <Modal show={showModal} handleClose={() => setShowModal(false)}>
              {loading ? <LoadingSpinner /> : <Gallery nfts={nfts} onSelect={handleSelectNFT} />}
            </Modal>
            <Input type="file" accept="image/*" onChange={(e) => { /* handle image upload */ }} id="image" placeholder="Upload an image" required />
            <Input type="text" name="name" onChange={handleChange} value={formData.name} id="name" placeholder="Your name?" required autoComplete="off" />
            <Input type="text" name="occupation" onChange={handleChange} value={formData.occupation} id="occupation" placeholder="Profession" required autoComplete="off" />
            <Input type="text" name="website" onChange={handleChange} value={formData.website} id="website" placeholder="Website" required autoComplete="off" />
            <Input type="email" name="email" onChange={handleChange} value={formData.email} id="email" placeholder="Email" required autoComplete="off" />
            <Textarea type="text" name="about" onChange={handleChange} value={formData.about} id="about" placeholder="A little bit about you.." rows="5" required autoComplete="off" />
            <Textarea type="text" name="services" onChange={handleChange} value={formData.services} id="services" placeholder="Services offered..." rows="5" required autoComplete="off" />
            <Button type="submit">Submit</Button>
          </UserInputWrap>
        </form>
      )}
      <Card 
        name={props_conf('name')} 
        occupation={props_conf('occupation')} 
        website={props_conf('website')} 
        email={props_conf('email')} 
        linkedin 
        about={props_conf('about')} 
        services={props_conf('services')} 
        github 
        twitter 
        instagram 
        colors={colors} 
        download_fun={download_image} 
        image_src={selectedNFT ? selectedNFT.imageUrl : image} 
        download_state={downloadState} 
        breakpoint={breakpoint} 
        downloadable={downloadable} 
      />
    </>
  );
};

export default CardForm;