import React from "react";
import aboutBg from "../../../assets/images/services/EthiohopeService/aboutBg.png";
import smallAboutBg from "../../../assets/images/services/EthiohopeService/smallAboutBg.png";
import womenImg from "../../../assets/images/services/EthiohopeService/womenImg.png";
import ctaImg1 from "../../../assets/images/services/EthiohopeService/ctaImg1.svg";
import ctaImg2 from "../../../assets/images/services/EthiohopeService/ctaImg2.svg";
import { GoChevronRight } from "react-icons/go";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  const h1Ref = useRef(null);
  const pRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // H1 typing animation
      gsap.fromTo(
        h1Ref.current,
        { width: 0 },
        {
          width: "100%",
          duration: 2,
          ease: "steps(40)",
          scrollTrigger: {
            trigger: h1Ref.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // H1 cursor blink animation
      gsap.to(h1Ref.current, {
        borderRightColor: "transparent",
        repeat: -1,
        duration: 0.5,
        yoyo: true,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: h1Ref.current,
          start: "top 80%",
          toggleActions: "play pause resume reset",
        },
      });

      // Paragraph slide up animation
      gsap.fromTo(
        pRef.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: pRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert(); // Cleanup
  }, []);
  const scrollToServices = () => {
    const servicesSection = document.getElementById("services-section");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="min-h-screen overflow-hidden flex items-center justify-center bg-[#010315] p-8">
      <div
        className="flex flex-col lg:flex-row gap-8 justify-between w-full items-center"
        style={{
          backgroundImage: `url(${aboutBg})`,
          backgroundPosition: "right",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPositionX: "250px",
        }}
      >
        {/* Left column: text */}
        <div ref={containerRef} className="lg:w-1/2 text-white">
          <div className="inline-block mb-6">
            <span className="px-3 py-1 rounded-full bg-[#0f1220]/60 border border-[#2b2340] text-sm">
              About us
            </span>
          </div>

          <h1
            ref={h1Ref}
            className="text-4xl md:text-5xl font-bold leading-tight mb-6 overflow-hidden whitespace-nowrap border-r-2 border-transparent"
          >
            Trusted Cybersecurity
            <br />
            Solutions Over 35 Years
          </h1>

          <p ref={pRef} className="text-lg text-[#cbd5e1] max-w-xl mb-8">
            With over 35 years of experience, innomax is a trusted leader in
            cybersecurity solutions, providing customized strategies to protect
            sensitive data. Our commitment to innovation and customer
            satisfaction makes us a reliable in safeguarding your digital
            assets.
          </p> 

          <Link to="/#/">
            <div
              style={{
                backgroundImage: `url("${ctaImg1}")`,
                backgroundPosition: "left",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                fontSize: "20px",
                width: "280px",
                height: "70px",
                transition: "background-image 300ms ease",
              }}
              className="hover:bg-contain hover:bg-left hover:bg-no-repeat"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundImage = `url("${ctaImg2}")`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundImage = `url("${ctaImg1}")`;
              }}
            >
              <button
                onClick={scrollToServices}
                className="text-white max-md:mx-auto flex gap-10 items-center cursor-pointer py-4 pl-6 justify-center"
              >
                <span className="block text-center pl-4">Get started now</span>
                <GoChevronRight className="inline-block ml-2 justify-end" />
              </button>
            </div>
          </Link>
        </div>

        {/* Right column */}
        <div className="w-1/2 justify-end z-10 relative">
          {" "}
          {/* Added relative here */}
          <div className="relative">
            {" "}
            {/* Added relative container */}
            {/* Small About Background - Made larger and absolute */}
            <div
              className="absolute pt-6 pl-6 flex items-center md:right-78 top-5 bg-cover bg-center w-[200px] h-[200px] transform scale-150"
              // Increased size with w/h and scale, you can adjust these values
              style={{
                backgroundImage: `url(${smallAboutBg})`,
                backgroundPosition: "right",
                zIndex: 20,
              }}
            >
              <div className="text-center">
                <div className="text-5xl md:text-4xl font-extrabold text-white">
                  120+
                </div>
                <div className=" text-[#cbd5e1]/90 mt-4">
                  Our honest specialist
                  <br />
                  team member
                </div>
              </div>
            </div>
            {/* Women Image - No changes */}
            <div className="flex items-end justify-end overflow-hidden">
              <div className="w-full h-full min-h-[200px] flex items-center justify-end">
                <img src={womenImg} alt="team member" className="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
