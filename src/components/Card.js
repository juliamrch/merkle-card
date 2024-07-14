import { CardWrap, CardStyled, MainContentWrapperStyled, IntroductionWrapperStyled } from '../styled/StyledCard'
import { ImageWrapperStyled, ImageLayer } from '../styled/ImageStyled'
import { HeadingStyled } from '../styled/Headings'
import Introduction from './Introduction'
import About from './About'
import Email from './Email'
import location from '../assets/mikoto-urabe.jpg'
import { Button } from '../styled/UserInputSection'
import { Tilt } from 'react-tilt'
import WalletsList from './WalletsList'


const Card = (props) => {
    var src = {
        img_src: props.image_src || location
    };

    // card JSX element
    const cardWithStylesJSX = (
        <CardStyled className="card" id="card" colors={props.colors}>
            <ImageWrapperStyled>
                <ImageLayer image_src={src.img_src} />
            </ImageWrapperStyled>
            <MainContentWrapperStyled>
                <IntroductionWrapperStyled>
                    <Introduction name={props.name} occupation={props.occupation} website={props.website} colors={props.colors} />
                    <About about={props.about} services={props.services} colors={props.colors} />
                    <Email email={props.email} colors={props.colors} />
                </IntroductionWrapperStyled>
                
            </MainContentWrapperStyled>
        </CardStyled>
    );

    return (
        <>
            <CardWrap id="cardwrap">
                <HeadingStyled>Preview</HeadingStyled>
                { props.breakpoint <= 43 ? cardWithStylesJSX : <Tilt className="Tilt" options={{ max: 20, scale: 1.01, perspective: 1100, speed: 500, reverse: false, transition: true }}>{cardWithStylesJSX}</Tilt> }
                <Button className="for-mobile download_btn" disabled={props.downloadable ? false : true} title={props.downloadable ? "" : "Please fill out all fields"} onClick={() => { props.download_fun() }}><div className="content">Download<i className={props.download_state ? "fas fa-circle-notch load" : "fas fa-download"}></i>{!props.downloadable && <div className="warn">Please fill out all the fields</div>}</div></Button>
                <WalletsList />
            </CardWrap>
        </>
    )
}

Card.defaultProps = {
  colors: {
    cardBackgroundColor: '#ffffff',
    nameColor: "#000000",
    occupationColor: "#000000",
    websiteColor: "#000000",
    aboutInterestsTitleColor: "#000000",
    descColor: "#000000",
    emailColor: "#000000",
    emailBackgroundColor: "#ffffff"
  },
  name: "Julia",
  email: "hey@lmeow.com",
  occupation: "Lmeow Capital",
  website: "",
  linkedin: "https://www.linkedin.com/",
  about: "gamblorrrr",
  services: "I offer bad luck, cat hair on clothes, and unhinged statements",
  github: "https://github.com/",
  twitter: "https://twitter.com/",
  instagram: "https://instagram.com/",
  image_src: location
};

export default Card;