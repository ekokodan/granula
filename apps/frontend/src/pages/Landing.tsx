import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import DecorativeSquares from "@/components/DecorativeSquares";
import { CalendarPlus, ArrowRight, PlayCircle, CheckSquare, Copyright } from "lucide-react";
import { toast } from "react-hot-toast";

const Landing = () => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = data.get("email");
    toast.success(`Thanks${email ? `, ${email}` : ""}! You're on the waitlist.`);
    form.reset();
  };

  return (
    <>
      <header className="w-full border-b border-border">
        <nav className="container py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gold-gradient" aria-hidden />
            <span className="text-lg font-heading font-semibold">Granula</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end leading-none">
              <span className="text-sm font-medium">Join the waitlist</span>
              <span className="text-sm text-muted-foreground">Get rewarded as first users</span>
            </div>
            <Button variant="hero" className="px-5">
              Join waitlist
              <ArrowRight className="ml-1" />
            </Button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="container grid lg:grid-cols-2 gap-12 py-16 lg:py-24 relative">
          <div className="flex flex-col gap-6 pt-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-semibold leading-tight">
              Transform your productivity with <span className="text-gradient-gold">Granula</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              The first AI-powered productivity app designed specifically for African professionals. Work offline, sync seamlessly, and collaborate culturally.
            </p>
            <div>
              <p className="text-base mb-2">Reserve your spot on the waitlist – Get Early Access</p>
              <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-xl">
                <Input name="email" type="email" placeholder="Enter email address" required className="h-14 text-base" />
                <Button type="submit" variant="hero" className="h-14 px-6 text-base">
                  Join waitlist
                  <ArrowRight className="ml-1" />
                </Button>
              </form>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -right-8 hidden lg:block">
              <DecorativeSquares />
            </div>
            <div className="rounded-lg border border-brand-gold/20 bg-card/50 p-2 shadow-glow animate-float">
              <div className="aspect-[16/10] w-full rounded-md bg-muted" aria-label="Granula dashboard preview" />
            </div>
          </div>
        </section>

        {/* Centered statement */}
        <section className="container py-10 lg:py-16 text-center">
          <div className="mx-auto max-w-3xl space-y-4">
            <h2 className="text-3xl lg:text-4xl font-heading font-semibold">
              Productivity Reimagined for African Excellence
            </h2>
            <p className="text-lg">
              Every feature designed with African professionals in mind — from unreliable internet to cultural collaboration patterns. Experience productivity that actually works for you.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="container grid lg:grid-cols-3 gap-6 lg:gap-8 py-6 lg:py-10">
          {/* Gradient feature card */}
          <article className="relative rounded-lg overflow-hidden bg-gold-vertical text-primary-foreground p-8 min-h-[28rem] flex flex-col items-center justify-center text-center">
            <CalendarPlus className="h-16 w-16 mb-6 opacity-95" />
            <h3 className="text-2xl font-semibold mb-3">AI Task Generation from Meetings</h3>
            <p className="text-white/90 max-w-md">
              Granula parses conference notes or audio transcripts to extract actionable items, turning them into tasks with smart defaults based on meeting context.
            </p>
            <DecorativeSquares color="white" opacity={0.25} className="-z-10 bottom-6 right-6" />
          </article>

          {/* Middle card */}
          <article className="rounded-lg border border-brand-gold p-8 flex flex-col items-center text-center gap-4">
            <CheckSquare className="h-16 w-16 text-brand-gold" />
            <h3 className="text-2xl font-semibold">Task Dependence Mapping</h3>
            <p className="text-muted-foreground">
              Granula recognises interdependent tasks and alerts users to blocks, allowing for proactive task sequencing.
            </p>
          </article>

          {/* Right column with metrics */}
          <div className="grid gap-6">
            <article className="rounded-lg border border-brand-gold p-10 text-center">
              <div className="text-gradient-gold text-6xl font-semibold leading-none mb-3">85%</div>
              <p className="text-base">Task completion speed</p>
            </article>
            <article className="rounded-lg border border-brand-gold p-10 text-center">
              <div className="text-gradient-gold text-6xl font-semibold leading-none mb-3">109%</div>
              <p className="text-base">Overall efficiency lift</p>
            </article>
          </div>
        </section>

        {/* How it works */}
        <section className="relative py-20 lg:py-28">
          <div className="container">
            <div className="rounded-lg bg-gold-vertical py-12 md:py-16 px-6 md:px-10 text-center relative overflow-hidden">
              <DecorativeSquares color="white" opacity={0.25} className="-z-0 left-10 bottom-10" />
              <h2 className="text-3xl lg:text-4xl font-heading font-semibold text-white mb-2">How Does It Work?</h2>
              <p className="text-white/90 max-w-2xl mx-auto mb-8">
                Empowering you to take charge of daily workload through a systematic approach and AI access points.
              </p>

              <div className="mx-auto max-w-4xl rounded-md shadow-lg relative overflow-hidden">
                <div className="aspect-video w-full rounded-md relative">
                  <img
                    src="/lovable-uploads/ea3eeef8-6348-4492-81e1-7ab51f96dcde.png"
                    alt="Granula dashboard preview showing tasks and metrics"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50" aria-hidden />
                  <div className="absolute inset-0 grid place-items-center">
                    <PlayCircle className="h-16 w-16 text-white/90" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container grid lg:grid-cols-2 gap-10 lg:gap-16 py-10 lg:py-16 items-start">
          <div className="space-y-3">
            <h2 className="text-3xl lg:text-4xl font-heading font-semibold">FAQ Section</h2>
            <p className="text-lg text-muted-foreground">Questions? We've Got Answers</p>
            <Button variant="link" className="p-0 text-brand-gold inline-flex items-center gap-2">
              More FAQs
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full divide-y">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left data-[state=open]:text-brand-gold data-[state=open]:font-semibold">When will Granula launch?</AccordionTrigger>
                <AccordionContent>Soon! Waitlist members get early access plus discounts.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left data-[state=open]:text-brand-gold data-[state=open]:font-semibold">How much will it cost?</AccordionTrigger>
                <AccordionContent>Free for basic features; premium plans start at ₦XY/month.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left data-[state=open]:text-brand-gold data-[state=open]:font-semibold">Is my data secure?</AccordionTrigger>
                <AccordionContent>Yes — we use industry best practices for encryption and secure sync.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left data-[state=open]:text-brand-gold data-[state=open]:font-semibold">Which countries are supported?</AccordionTrigger>
                <AccordionContent>Nigeria at launch — more soon!</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-border py-12">
        <div className="container relative">
          <p className="max-w-xl text-lg">
            AI-powered productivity designed specifically for African professionals. Work offline, sync seamlessly, collaborate culturally.
          </p>
          <div className="mt-6 flex items-center gap-2 text-muted-foreground">
            <Copyright className="h-5 w-5" />
            <span>2025. All rights reserved.</span>
          </div>
          <DecorativeSquares className="hidden md:grid right-6 bottom-6" />
        </div>
      </footer>
    </>
  );
};

export default Landing;

export const Component = Landing;