import React from "react";
import icon1 from "../../../assets/images/services/EthiohopeService/icon1.png";
import icon2 from "../../../assets/images/services/EthiohopeService/icon2.png";
import icon3 from "../../../assets/images/services/EthiohopeService/icon3.png";
import icon4 from "../../../assets/images/services/EthiohopeService/icon4.png";

const SecurityFeatures = () => {
  const features = [
    {
      icon: icon1,
      title: "Proactive Detection",
      desc: "We catch threats early to keep your systems safe.",
    },
    {
      icon: icon2,
      title: "Real-Time Response",
      desc: "We respond instantly minimizing to protect your systems.",
    },
    {
      icon: icon3,
      title: "AI-Powered Security",
      desc: "We use AI to enhance and ensuring detection and automate protection.",
    },
    {
      icon: icon4,
      title: "Risk & Compliance",
      desc: "We help you meet regulations and manage security risks effectively.",
    },
  ];

  return (
    <div className="bg-[#010315] text-white mx-5 px-5 py-10">
      <div
        className="
          grid gap-10 
          sm:grid-cols-1 
          md:grid-cols-2 
          lg:grid-cols-4 
          max-w-full mx-auto
        "
      >
        {features.map((item, index) => (
          <div key={index} className="flex flex-col space-y-2">
            <img
              src={item.icon}
              alt={item.title}
              className="w-18 h-18 object-contain"
            />
            <h3 className="text-2xl font-medium">{item.title}</h3>
            <p className="text-lg text-gray-300 max-w-xs">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityFeatures;
