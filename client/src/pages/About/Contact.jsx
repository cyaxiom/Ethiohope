// src/pages/About/Contact.jsx
import React from "react";
import GetInTouch from "../../components/About/Contact/GetInTouch";
import ContactForm from "../../components/About/Contact/ContactForm";
import ContactInfo from "../../components/About/Contact/ContactInfo";


const Contact = () => {
  // Public site uses the navy client theme
  const darkMode = true;

  return (
    <>
      <GetInTouch darkMode={darkMode} />
      <ContactInfo darkMode={darkMode} />
      <ContactForm darkMode={darkMode} />
    </>
  );
};

export default Contact;
