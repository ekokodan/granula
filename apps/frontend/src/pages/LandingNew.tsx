import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Features } from "@/components/Features";
import { WhyDifferent } from "@/components/WhyDifferent";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { Waitlist } from "@/components/Waitlist";
import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Landing = () => {
  const canonical = typeof window !== "undefined" ? window.location.href : "/";

  return (
    <>
      <Helmet>
        <title>Granula — AI productivity for African professionals</title>
        <meta name="description" content="AI-powered productivity app designed for African professionals. Work offline, sync seamlessly, and collaborate culturally." />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <div className="min-h-screen">
        <Navigation />
        <Hero />
        <Problem />
        <Features />
        <WhyDifferent />
        <Pricing />
        <FAQ />
        <Waitlist />
        <Footer />
      </div>
    </>
  );
};

export default Landing;

export const Component = Landing;