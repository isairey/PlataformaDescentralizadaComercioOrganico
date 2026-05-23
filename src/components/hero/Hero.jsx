import React from 'react';
import { CenterBody } from '../layout/CenterBody';
import FoodCarousel from './FoodCarousel';
import Mission from './Mission';

const Hero = () => {
  return (
    <>
    <div className="bg-gradient-to-r from-green-300 via-green-400 to-green-500 text-black">
      <CenterBody>
        <FoodCarousel />
        </CenterBody>
        <div className='bg-blue-500'>
        <Mission/>
        </div>
    </div>
</>
  );
};

export default Hero;
