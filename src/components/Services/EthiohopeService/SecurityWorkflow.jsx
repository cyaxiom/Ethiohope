import React from "react";
import { motion } from "framer-motion";
import img1 from "../../../assets/images/Services/EthiohopeService/img1.png";
import img2 from "../../../assets/images/Services/EthiohopeService/img2.png";
import img3 from "../../../assets/images/Services/EthiohopeService/img3.png";
import img4 from "../../../assets/images/Services/EthiohopeService/img4.png";
import img5 from "../../../assets/images/Services/EthiohopeService/img5.png";
import img6 from "../../../assets/images/Services/EthiohopeService/img6.png";
import img7 from "../../../assets/images/Services/EthiohopeService/img7.svg";
import bgservicework from "../../../assets/images/services/EthiohopeService/bgservicework.png";

const SecurityWorkflow = () => {
  const steps = [
    {
      id: '01',
      title: "Risk Assessment & Consultation",
      icon: img1,
      circle: img6,
      size: "small", // Small size for img4
    },
    {
      id: '02',
      title: "Solution Design and Implementation",
      icon: img2,
      circle: img5,
      size: "large", // Large size for img5
    },
    {
      id: '03',
      title: "Monitoring and Support",
      icon: img3,
      circle: img6,
      size: "small", // Small size for img6
    },
  ];

  return (
    <div
      className="py-16 px-4 text-white rounded-3xl mx-4 md:mx-12 lg:mx-10 my-12"
      style={{
        backgroundImage: `url(${bgservicework})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="text-center mb-12">
        <div className="px-4 py-1 flex justify-center text-[#8D8C97] mb-3">
          <span className="flex justify-evenly gap-1 w-[130px] border-[#6e6c75] rounded-full border bg-[#1C1C2E] ">
            <img src={img7} alt="" className="text-[15px]" />
            How we work
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold inline-block px-4 py-1 rounded-md">
          Our Security Workflow
        </h2>
      </div>

      <div className="flex flex-col md:flex-row justify-evenly py-20 items-center gap-10">
        {steps.map((step, index) => (
          <div key={index} className="flex relative flex-col items-center">
            {/* Rotating Circle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 25,
                ease: "linear",
              }}
              className="relative flex items-center justify-center"
            >
              <img
                src={step.circle}
                alt="circle"
                className={`${step.size === "small"
                  ? "w-44 md:w-50 lg:w-58" // Smaller size for img4 and img6
                  : "w-56 md:w-64 lg:w-72" // Larger size for img5
                  }`}
              />
            </motion.div>
            {/* Fixed Content Inside Circle */}
            <div
              className={`absolute top-[33%] transform -translate-y-[38%] flex flex-col items-center justify-center ${step.id == '02' ? 'w-48 h-48 md:w-52 md:h-52 lg:w-60 lg:h-60' : ' w-38 h-38 md:w-40 md:h-40 lg:w-48 lg:h-48'}  rounded-full`}
              style={{
                backgroundColor: "#6D3CCB",
              }}
            >
              <img
                src={step.icon}
                alt="icon"
                className="w-12 md:w-14 mb-2"
              />
              <h3 className="text-center text-[15px] md:text-[18px]">
                {step.title}
              </h3>
            </div>

            {/* Step Number */}
            <div className="mt-4 hidden lg:block rounded-sm px-2 py-0.5 text-xl font-semibold">
              {step.id}
            </div>

            {/* Arrow (between items except last) */}
            {index < steps.length - 1 && (
              <div className="absolute text-blue-400 mt-[130px] ml-[390px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="30"
                  fill="none"
                  viewBox="0 0 80 20"
                >
                  <path
                    d="M0 15h75m0 0l-5-5m5 5l-5 5"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityWorkflow;