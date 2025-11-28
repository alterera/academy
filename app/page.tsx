import Certificate from "@/components/Certificate";
import CTA from "@/components/CTA";
import FAQs from "@/components/FAQs";
// import Featured from "@/components/Featured";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import WhyUs from "@/components/WhyUs";
import Image from "next/image";

export default function Home() {
  return (
    <>
    <Hero />
    {/* <Featured /> */}
    <WhyUs />
    <Certificate />
    <Testimonials />
    <FAQs />
    <CTA />
    </>
  );
}
