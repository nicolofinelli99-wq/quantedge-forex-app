import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SampleStrategy } from "@/components/landing/SampleStrategy";
import { ROICalculator } from "@/components/landing/ROICalculator";
import { Pricing } from "@/components/landing/Pricing";
import { Compare } from "@/components/landing/Compare";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <SampleStrategy />
      <ROICalculator />
      <Pricing />
      <Compare />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
