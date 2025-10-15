import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export const Waitlist = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Welcome to Granula! 🎉",
        description: "You're on the waitlist! Check your email for exclusive updates.",
      });
      setEmail("");
      setName("");
      setLoading(false);
    }, 1000);
  };

  return (
    <section id="waitlist" className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
            Join 10,000+ on the Waitlist
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Be the first to experience productivity built for Africa. Get early access and 3 months free Premium.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 bg-card/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-12 text-lg"
            />
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 text-lg"
            />
            <Button
              type="submit"
              variant="cta"
              size="lg"
              className="w-full text-lg h-12"
              disabled={loading}
            >
              {loading ? "Joining..." : "Join the Waitlist"}
            </Button>
            <p className="text-xs text-muted-foreground">
              By signing up, you agree to receive updates about Granula. Unsubscribe anytime.
            </p>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-primary-foreground/80">
            <div>
              <p className="text-2xl font-bold">10,000+</p>
              <p className="text-sm">Waitlist Members</p>
            </div>
            <div>
              <p className="text-2xl font-bold">50+</p>
              <p className="text-sm">Partner Universities</p>
            </div>
            <div>
              <p className="text-2xl font-bold">15+</p>
              <p className="text-sm">Countries</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
