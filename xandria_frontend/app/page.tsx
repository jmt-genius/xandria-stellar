import Link from "next/link";
import dynamic from "next/dynamic";
import LandingNav from "@/components/landing/landing-nav";
import HeroSection from "@/components/landing/hero-section";

const ScrollStory = dynamic(() => import("@/components/landing/scroll-story"), {
  loading: () => <div className="h-[400vh]" />,
});
const ValueCards = dynamic(() => import("@/components/landing/value-cards"), {
  loading: () => null,
});

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNav />
      <HeroSection />
      <ScrollStory />
      <ValueCards />

      {/* Bottom CTA */}
      <section className="py-24 text-center">
        <div className="mx-auto w-16 h-[1px] bg-accent mb-8" />
        <Link
          href="/marketplace"
          className="inline-block py-3.5 px-10 bg-accent text-background font-body font-medium text-sm transition-opacity hover:opacity-90"
        >
          Enter the Library
        </Link>
        <p className="font-body text-xs text-text-muted mt-4">
          Built on Stellar. Open forever.
        </p>
      </section>
    </div>
  );
}
