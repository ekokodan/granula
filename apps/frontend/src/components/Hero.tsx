import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-background to-primary/5">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-up">
            <div className="inline-block">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                🚀 Built for Africa
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Save <span className="bg-gradient-hero bg-clip-text text-transparent">3 Hours Daily</span> with AI-Powered Tasks
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              The first productivity app built for African students, SMEs, and professionals. 
              Works offline, bills in local currency, and speaks your language.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                variant="cta" 
                onClick={scrollToWaitlist}
                className="text-lg"
              >
                Join the Waitlist
                <ArrowRight className="ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg"
              >
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-primary">10k+</p>
                <p className="text-sm text-muted-foreground">Early Adopters</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">50+</p>
                <p className="text-sm text-muted-foreground">Universities</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">100%</p>
                <p className="text-sm text-muted-foreground">African-Made</p>
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative animate-fade-in">
            <div className="absolute inset-0 bg-gradient-hero opacity-20 blur-3xl rounded-full"></div>
            <img 
              src="/assets/hero-image.jpg" 
              alt="African professionals using Granula productivity app"
              className="relative rounded-2xl shadow-2xl w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};