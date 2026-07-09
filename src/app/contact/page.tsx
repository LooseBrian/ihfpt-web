import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TopBar } from "@/components/layout/TopBar";
import { BackToTop } from "@/components/shared/BackToTop";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactOffices } from "@/components/contact/ContactOffices";
import { ContactRoles } from "@/components/contact/ContactRoles";
import { ContactStats } from "@/components/contact/ContactStats";
import { CTASection } from "@/components/sections/CTASection";

export default function ContactPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main className="flex-1 bg-muted/20">
        <ContactHero />
        <ContactChannels />
        <ContactForm />
        <ContactOffices />
        <ContactRoles />
        <ContactStats />
        <CTASection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
