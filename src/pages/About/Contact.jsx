// src/pages/About/Contact.jsx
import React from "react";
import GetInTouch from "../../components/About/Contact/GetInTouch";
import ContactForm from "../../components/About/Contact/ContactForm";
import ContactInfo from "../../components/About/Contact/ContactInfo";
import Newsletter from "../../components/About/Contact/NewsLetter";


const Contact = () => {
  return (
    <>
      <GetInTouch />
    
      <ContactInfo />
      <ContactForm />
      <Newsletter />
    </>
  );
};

export default Contact;
