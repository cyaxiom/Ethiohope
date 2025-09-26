// src/components/About/Contact/GetInTouch.jsx
import React from "react";
import styles from "./GetInTouch.module.css";

// import getInTouchBgImage from "../../../assets/images/contact/getIntouchBgImage.png";
import getIntouchicon from "../../../assets/images/contact/getIntouchicons.png";
import getIntouchicon2 from "../../../assets/images/contact/getIntouchicon2.png";
import getIntouchicon3 from "../../../assets/images/contact/getIntouchicon3.png";
import getIntouchicon4 from "../../../assets/images/contact/getIntouchicon4.png";
import getintouchBg from "../../../assets/images/contact/getintouchBg.png";

const GetInTouch = () => {
   return (
      <section
         className="relative h-[100vh] w-full !pt-32 flex flex-col items-center justify-center text-white overflow-hidden"
         style={{
            backgroundImage: `url(${getintouchBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
         }}
      >
         <div className="absolute inset-0 bg-gradient-to-bl from-blue-900/30 via-purple-900/50 to-indigo-900/70 mix-blend-overlay"></div>
         <div className="h-[50vh] border-b w-full">
            {/* Animated Icons */}
            <img
               src={getIntouchicon}
               alt="icon1"
               className={`${styles.floatIcon} absolute top-1/3 left-1/10 w-20 hidden md:block`}
            />
            <img
               src={getIntouchicon2}
               alt="icon2"
               className={`${styles.floatIcon} absolute top-1/3 right-1/10 w-20 hidden md:block`}
            />
            <img
               src={getIntouchicon3}
               alt="icon3"
               className={`${styles.floatIcon} absolute bottom-1/4 left-1/6 w-24 hidden md:block`}
            />
            <img
               src={getIntouchicon4}
               alt="icon4"
               className={`${styles.floatIcon} absolute bottom-1/4 right-1/6 w-24 hidden md:block`}
            />

            {/* Title */}
            <div className="text-center mb-16 relative z-10">
               <h2 className="text-6xl font-bold mb-4">Get in touch</h2>
               <p className="text-gray-300 text-lg"> <a href="/">Home</a> - Contact Us</p>
            </div>

         </div>

      </section>
   );
};

export default GetInTouch;