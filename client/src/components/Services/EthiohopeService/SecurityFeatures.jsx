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
    <div className="bg-background text-foreground px-4 md:px-6 lg:px-8 py-10 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-6 md:gap-8 lg:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <div key={index} className="flex flex-col space-y-3 p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:transform hover:-translate-y-2">
              <img
                src={item.icon}
                alt={item.title}
                className="w-18 h-18 object-contain"
              />
              <h3 className="text-2xl font-medium text-foreground">{item.title}</h3>
              <p className="text-lg text-muted-foreground max-w-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityFeatures;
