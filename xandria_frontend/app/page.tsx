import dynamic from "next/dynamic";
import LandingNav from "@/components/landing/landing-nav";
import HeroSection from "@/components/landing/hero-section";

const ScrollStory = dynamic(() => import("@/components/landing/scroll-story"), {
  loading: () => <div className="h-[250vh]" />,
});
const ManifestoSection = dynamic(
  () => import("@/components/landing/manifesto-section"),
  { loading: () => <div className="h-[60vh]" /> }
);
const PillarsSection = dynamic(
  () => import("@/components/landing/pillars-section"),
  { loading: () => <div className="h-[80vh]" /> }
);
const EditionSection = dynamic(
  () => import("@/components/landing/edition-section"),
  { loading: () => <div className="h-[80vh]" /> }
);
const ProtectionSection = dynamic(
  () => import("@/components/landing/protection-section"),
  { loading: () => <div className="h-[80vh]" /> }
);
const StellarSection = dynamic(
  () => import("@/components/landing/stellar-section"),
  { loading: () => <div className="h-[80vh]" /> }
);
const CtaSection = dynamic(() => import("@/components/landing/cta-section"), {
  loading: () => <div className="h-[60vh]" />,
});

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background landing-grain">
      <LandingNav />
      <HeroSection />
      <ScrollStory />
      <ManifestoSection />
      <PillarsSection />
      <EditionSection />
      <ProtectionSection />
      <StellarSection />
      <CtaSection />
    </div>
  );
}
