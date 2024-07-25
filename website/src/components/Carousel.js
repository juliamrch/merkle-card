import React from 'react';
import Slider from 'react-slick';
import { Box, Typography, Container } from '@mui/material';
import { styled } from '@mui/system';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const StyledSlider = styled(Slider)`
  .slick-slide {
    padding: 0 10px;
  }
  .slick-prev, .slick-next {
    z-index: 1;
    &:before {
      color: #000;
    }
  }
`;

const ImageWrapper = styled(Box)`
  img {
    width: 100%;
    max-width: 200px,
    max-height: 200px,
    height: auto;
    object-fit: cover;
  }
`;

const Carousel = ({ carouselData, imageSelectHandler }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 8,
        slidesToScroll: 6,
        lazyLoad: true,
        rows: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    const handler = imageSelectHandler ? imageSelectHandler : () => { }

    return (
        <Container>
            <StyledSlider {...settings}>
                {carouselData.map((item, index) => (
                    <Box key={index}>
                        <ImageWrapper>
                            <img src={item.image} alt={item.name} onClick={() => handler(item)} style={{ cursor: 'pointer' }} />
                        </ImageWrapper>
                        <Typography variant="body1" align="center" mt={2} onClick={() => handler(item)} style={{ cursor: 'pointer' }}>
                            {item.name}
                        </Typography>
                        <Typography variant="body2" align="center" mt={2} style={{ cursor: 'pointer' }}>
                            {item.address?.substring(0, 6)}
                        </Typography>
                    </Box>
                ))}
            </StyledSlider>
        </Container>
    );
};

export default Carousel;
