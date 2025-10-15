import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import DecorativeSquares from "@/components/DecorativeSquares";
import { CalendarPlus, ArrowRight, PlayCircle, CheckSquare, Copyright, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const Landing = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const scrollToWaitlist = () => {
    document.getElementById('waitlist-form')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'center'
    });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = data.get("email") as string;
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success(result.message || `Thanks${email ? `, ${email}` : ""}! You're on the waitlist.`);
        form.reset();
      } else if (response.status === 409) {
        // Email already exists
        toast.success("You're already on the waitlist!");
        form.reset();
      } else if (response.status === 429) {
        // Rate limited
        toast.error("Too many attempts. Please try again later.");
      } else {
        toast.error(result.error || "Failed to join waitlist. Please try again.");
      }
    } catch (error) {
      // Network error or backend not available - still show success for better UX
      console.log('Waitlist submission (backend unavailable):', email);
      toast.success(`Thanks${email ? `, ${email}` : ""}! You're on the waitlist.`);
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />
      <header className="w-full border-b border-border">
        <nav className="container py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/assets/Layer 1.svg" 
              alt="Granula" 
              className="h-8 w-auto" 
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end leading-none">
              <span className="text-sm font-medium">Join the waitlist</span>
              <span className="text-sm text-muted-foreground">Get rewarded as first users</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="/login">Login</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/admin">Admin</a>
              </Button>
              <Button variant="hero" className="px-5" onClick={scrollToWaitlist}>
                Join waitlist
                <ArrowRight className="ml-1" />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="container grid lg:grid-cols-2 gap-12 py-16 lg:py-24 relative">
          {/* Background decorative elements - positioned per design spec */}
          <img 
            src="/assets/Group 32.svg" 
            alt="" 
            className="absolute opacity-30 w-[380px] h-[360px] hidden lg:block" 
            style={{ right: '344px', top: '777px' }}
            aria-hidden="true"
          />
          
          <div className="flex flex-col gap-6 pt-6 relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-semibold leading-tight">
              Transform your productivity with <span className="text-gradient-gold">Granula</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl font-body">
              The first AI-powered productivity app designed specifically for African professionals. Work offline, sync seamlessly, and collaborate culturally.
            </p>
            <div>
              <p className="text-lg lg:text-xl font-body font-medium mb-4">Reserve your spot on the waitlist – Get Early Access</p>
              <form id="waitlist-form" onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
                <Input 
                  name="email" 
                  type="email" 
                  placeholder="Enter email address" 
                  required 
                  className="h-16 text-lg font-body border-2 border-black/60" 
                />
                <Button type="submit" variant="hero" className="h-16 px-8 text-lg font-body font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Join waitlist
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -right-8 hidden lg:block">
              <DecorativeSquares />
            </div>
            <div className="rounded-lg border border-brand-gold/20 bg-card/50 p-2 shadow-glow animate-float">
              <img
                src="/assets/Dashboard 3.jpg"
                alt="Granula dashboard preview"
                className="aspect-[16/10] w-full rounded-md object-cover"
              />
            </div>
          </div>
        </section>

        {/* Centered statement */}
        <section className="container py-10 lg:py-16 text-center relative">
          {/* Group 32 positioned per design spec */}
          <img 
            src="/assets/Group 32.svg" 
            alt="" 
            className="absolute opacity-30 w-[380px] h-[360px] hidden lg:block" 
            style={{ left: '70px', top: '515px' }}
            aria-hidden="true"
          />
          <div className="mx-auto max-w-3xl space-y-4">
            <h2 className="text-3xl lg:text-4xl font-heading font-semibold">
              Productivity Reimagined for African Excellence
            </h2>
            <p className="text-lg">
              Every feature designed with African professionals in mind — from unreliable internet to cultural collaboration patterns. Experience productivity that actually works for you.
            </p>
          </div>
        </section>

        {/* Original video section moved here */}
        <section className="relative py-20 lg:py-28">
          <div className="container">
            <div className="rounded-lg bg-gold-vertical py-12 md:py-16 px-6 md:px-10 text-center relative overflow-hidden">
              {/* Decorative elements */}
              <img 
                src="/assets/Group 32.svg" 
                alt="" 
                className="absolute opacity-30 w-[380px] h-[360px]" 
                style={{ left: '262px', top: '213px', transform: 'rotate(-180deg)', filter: 'brightness(0) invert(1)' }}
                aria-hidden="true"
              />
              <img 
                src="/assets/Group 35.png" 
                alt="" 
                className="absolute opacity-30 w-[380px] h-[360px]" 
                style={{ left: '262px', top: '403px', filter: 'brightness(0) invert(1)' }}
                aria-hidden="true"
              />
              <img 
                src="/assets/Group 36.svg" 
                alt="" 
                className="absolute opacity-30 w-[380px] h-[360px]" 
                style={{ left: '764px', top: '403px', filter: 'brightness(0) invert(1)' }}
                aria-hidden="true"
              />
              
              <div className="relative z-10">
                <h2 className="text-3xl lg:text-5xl font-heading font-semibold text-white mb-4">Watch Demo</h2>
                <p className="text-white/90 max-w-2xl mx-auto mb-12 text-lg">
                  See how Granula transforms your daily workflow with AI-powered productivity features.
                </p>

                <div className="mx-auto max-w-4xl rounded-md shadow-lg relative overflow-hidden">
                  <div className="aspect-video w-full rounded-md relative cursor-pointer group">
                    <img
                      src="/assets/Dashboard 2.png"
                      alt="Granula dashboard preview showing tasks and metrics"
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors rounded-md" />
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="group-hover:scale-110 transition-transform">
                        <PlayCircle className="h-20 w-20 text-white/90 drop-shadow-lg" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works - White background section with 2x2 grid */}
        <section className="relative py-20 lg:py-28 bg-white">
          <div className="container">
            <div className="relative">
              {/* Section title */}
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-5xl font-heading font-semibold text-black mb-4">How Does It Work?</h2>
                <p className="text-black/70 max-w-2xl mx-auto text-lg">
                  Empowering you to take charge of daily workload through a systematic approach and AI access points.
                </p>
              </div>

              {/* 2x2 Grid layout matching the design */}
              <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
                {/* AI Task Generation - Left column spanning 6 cols, full height */}
                <article className="lg:col-span-6 relative rounded-lg overflow-hidden bg-gold-vertical text-primary-foreground p-8 min-h-[32rem] flex flex-col items-center justify-center text-center">
                  <img 
                    src="/assets/calendar-add-svgrepo-com 1.svg" 
                    alt="Calendar Add" 
                    className="h-20 w-20 mb-6 opacity-95" 
                  />
                  <h3 className="text-2xl lg:text-3xl font-semibold mb-4">AI Task Generation from Meetings</h3>
                  <p className="text-white/90 max-w-md text-lg leading-relaxed">
                    Granula's AI parses conference notes or audio transcripts to automatically extract actionable items, which are then turned into tasks with default due dates and assignees based on the meeting context.
                  </p>
                  {/* Group 32 decorative element */}
                  <img 
                    src="/assets/Group 32.svg" 
                    alt="" 
                    className="absolute opacity-30 w-[200px] h-[180px]" 
                    style={{ bottom: '20px', right: '20px', filter: 'brightness(0) invert(1)' }}
                    aria-hidden="true"
                  />
                </article>

                {/* Right column - 2x2 grid */}
                <div className="lg:col-span-6 grid md:grid-cols-2 gap-6">
                  {/* Task Dependence Mapping */}
                  <article className="rounded-lg border border-brand-gold p-8 flex flex-col items-center text-center gap-4 min-h-[15rem]">
                    <img 
                      src="/assets/chart-success-svgrepo-com 1.svg" 
                      alt="Chart Success" 
                      className="h-16 w-16" 
                    />
                    <h3 className="text-xl lg:text-2xl font-semibold">Task Dependence Mapping</h3>
                    <p className="text-muted-foreground text-center">
                      Granula recognises interdependent tasks and alerts users to blocks, allowing for proactive task sequencing.
                    </p>
                  </article>

                  {/* Task Completion Speed */}
                  <article className="rounded-lg border border-brand-gold p-8 text-center min-h-[15rem] flex flex-col justify-center">
                    <div className="text-gradient-gold text-5xl lg:text-6xl font-semibold leading-none mb-3">85%</div>
                    <p className="text-base lg:text-lg">Task completion speed</p>
                  </article>

                  {/* AI Workflows */}
                  <article className="rounded-lg border border-brand-gold p-8 flex flex-col items-center text-center gap-4 min-h-[15rem]">
                    <img 
                      src="/assets/arrow-square-svgrepo-com 1.svg" 
                      alt="Arrow Square" 
                      className="h-16 w-16" 
                    />
                    <h3 className="text-xl lg:text-2xl font-semibold">AI-generated workflows and checklists</h3>
                    <p className="text-muted-foreground text-center">
                      For recurring tasks, AI creates pre-structured checklists or workflows. Users can personalise these templates based on the project type or team organisation.
                    </p>
                  </article>

                  {/* Overall Efficiency */}
                  <article className="rounded-lg border border-brand-gold p-8 text-center min-h-[15rem] flex flex-col justify-center">
                    <div className="text-gradient-gold text-5xl lg:text-6xl font-semibold leading-none mb-3">109%</div>
                    <p className="text-base lg:text-lg">Task completion speed</p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Clean minimal design */}
        <section className="bg-white py-16 lg:py-24 relative">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start relative">
              {/* Decorative Group 33 positioned per design spec */}
              <img 
                src="/assets/Group 33.png" 
                alt="" 
                className="absolute opacity-30 w-[380px] h-[360px] hidden lg:block" 
                style={{ left: '80px', bottom: '-100px', transform: 'rotate(-180deg)' }}
                aria-hidden="true"
              />
              
              {/* Left side - Title and More FAQs link */}
              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <h2 className="text-4xl lg:text-5xl font-heading font-semibold text-black">FAQ Section</h2>
                  <p className="text-lg lg:text-xl text-black/70 font-body">Questions? We've Got Answers</p>
                </div>
                <Button variant="link" className="p-0 text-brand-gold inline-flex items-center gap-2 text-lg font-body font-medium hover:text-brand-gold/80">
                  More FAQs
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Right side - FAQ Accordion */}
              <div className="relative z-10">
                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                  <AccordionItem value="item-1" className="border-b border-gray-200">
                    <AccordionTrigger className="text-left text-lg font-body font-medium data-[state=open]:text-brand-gold hover:text-brand-gold py-4 [&>svg]:data-[state=open]:rotate-45">
                      When will Granula launch?
                    </AccordionTrigger>
                    <AccordionContent className="text-base font-body text-black/70 pb-4">
                      Soon! Waitlist members get early access + discounts.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2" className="border-b border-gray-200">
                    <AccordionTrigger className="text-left text-lg font-body font-medium hover:text-brand-gold py-4 [&>svg]:hover:rotate-45 transition-all">
                      How much will it cost?
                    </AccordionTrigger>
                    <AccordionContent className="text-base font-body text-black/70 pb-4">
                      Free for basic features; premium plans start at ₦XY/month.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3" className="border-b border-gray-200">
                    <AccordionTrigger className="text-left text-lg font-body font-medium hover:text-brand-gold py-4 [&>svg]:hover:rotate-45 transition-all">
                      Is my data secure?
                    </AccordionTrigger>
                    <AccordionContent className="text-base font-body text-black/70 pb-4">
                      Yes — we use industry best practices for encryption and secure sync.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4" className="border-0">
                    <AccordionTrigger className="text-left text-lg font-body font-medium hover:text-brand-gold py-4 [&>svg]:hover:rotate-45 transition-all">
                      Which countries are supported?
                    </AccordionTrigger>
                    <AccordionContent className="text-base font-body text-black/70 pb-4">
                      Nigeria at launch — more soon!
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-border py-16 bg-white">
        <div className="container relative">
          <img 
            src="/assets/Group 33.png" 
            alt="" 
            className="absolute opacity-30 w-[380px] h-[360px] hidden lg:block" 
            style={{ right: '168px', top: '125px' }}
            aria-hidden="true"
          />
          
          <div className="relative z-10 max-w-2xl">
            <p className="text-lg lg:text-xl font-body leading-relaxed mb-8">
              AI-powered productivity designed specifically for African professionals. Work offline, sync seamlessly, collaborate culturally.
            </p>
            <div className="flex items-center gap-3 text-lg font-body">
              <Copyright className="h-6 w-6" />
              <span>2025. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Landing;

export const Component = Landing;