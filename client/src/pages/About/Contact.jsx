// src/pages/About/Contact.jsx
import React from "react";
import { useTheme } from '@provider/ThemeProvider/ThemeProvider';
import GetInTouch from "../../components/About/Contact/GetInTouch";
import ContactForm from "../../components/About/Contact/ContactForm";
import ContactInfo from "../../components/About/Contact/ContactInfo";


const Contact = () => {
  const { isDark } = useTheme();

  return (
    <>
      <GetInTouch darkMode={isDark} />
      <ContactInfo darkMode={isDark} />
      <ContactForm darkMode={isDark} />
    </>
  );
};

export default Contact;
