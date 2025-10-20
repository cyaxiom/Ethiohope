import React from 'react'
import Hero from "../../../components/Services/EthiohopeService/Hero"
import ClientLogos from '../../../components/Services/EthiohopeService/ClientLogos'
import RecentSEOWork from '../../../components/Services/EthiohopeService/RecentSEOWork'
import AboutUs from '../../../components/Services/EthiohopeService/Aboutus'


function EthiohopeService() {
  return (
    <div className='bg-[#010215]'>
      <Hero />
      <ClientLogos />
      <RecentSEOWork />
      <AboutUs />
    </div>
  )
}

export default EthiohopeService
