import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Pricing = () => {
  const plans = [
    {
      name: "Student",
      price: "₦1,500",
      period: "/month",
      description: "Perfect for students and individual learners",
      features: [
        "AI task extraction",
        "Offline mode",
        "100 tasks per month",
        "Basic collaboration",
        "Mobile app access"
      ]
    },
    {
      name: "Professional",
      price: "₦3,500",
      period: "/month",
      description: "For freelancers and professionals",
      features: [
        "Everything in Student",
        "Unlimited tasks",
        "Advanced AI features",
        "Priority support",
        "Team collaboration (up to 5)",
        "Custom reminders"
      ],
      popular: true
    },
    {
      name: "Business",
      price: "₦8,000",
      period: "/month",
      description: "For SMEs and growing teams",
      features: [
        "Everything in Professional",
        "Unlimited team members",
        "Advanced analytics",
        "API access",
        "Dedicated account manager",
        "Custom integrations"
      ]
    }
  ];

  const scrollToWaitlist = () => {
    document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, <span className="text-primary">Affordable Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No hidden fees. No dollar surprises. Pay in your local currency.
          </p>
          <div className="mt-6 inline-block bg-accent/10 px-6 py-3 rounded-full">
            <p className="text-accent font-semibold">
              🎉 Early adopters get 3 months free Premium!
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-card rounded-2xl p-8 border-2 transition-all duration-300 animate-fade-up ${
                plan.popular
                  ? "border-primary shadow-glow scale-105"
                  : "border-border hover:border-primary/50 hover:shadow-soft"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-cta text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "cta" : "hero"}
                className="w-full"
                onClick={scrollToWaitlist}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Prices shown in Nigerian Naira. Also available in Kenyan Shillings, Ghanaian Cedis, and more.
        </p>
      </div>
    </section>
  );
};
