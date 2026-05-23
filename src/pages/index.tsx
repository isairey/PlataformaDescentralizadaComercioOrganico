import Footer from "@/components/footer/Footer";
import Hero from "@/components/hero/Hero";
import type { NextPage } from "next";
import "twin.macro";

const HomePage: NextPage = () => {
  return (
    <>
      <Hero />
      <Footer />
    </>
  );
};

export default HomePage;
