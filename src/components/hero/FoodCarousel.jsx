import React from 'react';
import { Carousel } from 'react-bootstrap';
import FoodCarousel1 from "/public/assests/image/carousel1.jpg";
import FoodCarousel2 from "/public/assests/image/carousel2.jpg";
import FoodCarousel3 from "/public/assests/image/carousel3.jpg";
import Image from 'next/image';


const FoodCarousel = () => {
  return (
<div style={{display: 'block', width: 700, padding: 30, zIndex: -10}}>    
<Carousel fade>
      <Carousel.Item interval={2500}>
        <Image
        className='d-block w-100'
          width={600}
          height={400}
          src={FoodCarousel1}
          alt="Local Organic Fruits"
        />
        <Carousel.Caption>
            <div className='text-white text-2xl bg-black'>
          <h3>Fresh and Organic Fruits</h3>
          <p>Support local farmers and enjoy the best quality fruits.</p>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={2500}>
      <Image
      className='d-block w-100'
          width={700}
          height={700}
          src={FoodCarousel2}
          alt="Local Organic Fruits"
        />
        <Carousel.Caption>
        <div className='text-white text-2xl bg-black'>
          <h3>Nutritious Local Vegetables</h3>
          <p>Discover the taste of fresh, locally grown vegetables.</p>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item interval={2500}>
      <Image
      className='d-block w-100'
          width={600}
          height={400}
          src={FoodCarousel3}
          alt="Local Organic Fruits"
        />
        <Carousel.Caption>
        <div className='text-white text-2xl bg-black'>
          <h3>Local Organic Products</h3>
          <p>Choose organic products that are good for you and the environment.</p>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    </div>
  );
};

export default FoodCarousel;
