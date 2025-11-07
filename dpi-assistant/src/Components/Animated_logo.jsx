import React from "react";
import Lottie from "lottie-react";
import logoAnimation from "./Data/logoLottie.json"; // use as it is

const Animated_Logo = () => {
  return (
    <div >
      <Lottie  style={{ width: 60, height: 60 }}  animationData={logoAnimation} loop={true} autoplay={true} />
    </div>
  );
};

export default Animated_Logo;