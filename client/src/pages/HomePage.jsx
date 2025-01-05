import React from "react";
import {
  DentalHero,
  Testimonials,
  Container,
  Features,
  About,
  Contact
} from "../components";

const HomePage = () => {
  return (
    <>
      <DentalHero />
      <Features />
      <About />
      <Testimonials />
      <Contact/>
      <Container></Container>
    </>
  );
};

export default HomePage;
