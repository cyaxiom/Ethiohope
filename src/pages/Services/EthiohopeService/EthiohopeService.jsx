import React from "react";
import Hero from "../../../components/Services/EthiohopeService/Hero";
import ClientLogos from "../../../components/Services/EthiohopeService/ClientLogos";
import RecentSEOWork from "../../../components/Services/EthiohopeService/RecentSEOWork";
import AboutUs from "../../../components/Services/EthiohopeService/AboutUs";
import SecurityFeatures from "../../../components/Services/EthiohopeService/SecurityFeatures";
import SecurityWorkflow from "../../../components/Services/EthiohopeService/SecurityWorkflow";
import IndustriesSection from "../../../components/Services/EthiohopeService/IndustriesSection";
import CustomerStories from "../../../components/Services/EthiohopeService/CustomerStories";

function EthiohopeService() {
  return (
    <div className="bg-[#010215]">
      <Hero />
      <ClientLogos />
      <RecentSEOWork />
      <AboutUs />
      <SecurityFeatures />
      <SecurityWorkflow />
      <IndustriesSection />
      <CustomerStories />
    </div>
  );
}

export default EthiohopeService;
