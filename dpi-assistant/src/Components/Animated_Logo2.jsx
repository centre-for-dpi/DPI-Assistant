// src/components/Animated_Logo.jsx
import React from "react";
import Lottie from "lottie-react";
import logoAnimation from "./Data/logoLottie.json";

const Animated_Logo2 = () => {
  return (
    <Lottie
      animationData={logoAnimation}
      loop
      autoplay
      className="mx-auto w-[85px] h-[85px] mt-[15px] md:w-[150px] md:h-[150px] lg:w-[100px] lg:h-[100px] md:mt-[29px]"
    />
  );
};

export default Animated_Logo2;
