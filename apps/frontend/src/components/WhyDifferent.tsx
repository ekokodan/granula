import { Check } from "lucide-react";

export const WhyDifferent = () => {
  const differences = [
    {
      label: "Local-First Design",
      granula: "Built specifically for African workflows and challenges",
      others: "Generic tools adapted from Western markets"
    },
    {
      label: "Pricing",
      granula: "Affordable rates in local currency, starts at ₦2,000/month",
      others: "$15-30/month with forex charges"
    },
    {
      label: "Connectivity",
      granula: "Full offline functionality, syncs when available",
      others: "Requires constant internet connection"
    },
    {
      label: "Language Support",
      granula: "English, Pidgin, Swahili, Yoruba, and growing",
      others: "English only or limited African languages"
    },
    {
      label: "Payment Methods",
      granula: "Mobile money, local cards, bank transfer",
      others: "International cards only"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Granula is <span className="text-primary">Different</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Not just another productivity app. Built from the ground up for Africa.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {differences.map((diff, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 shadow-soft hover:shadow-glow transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="grid md:grid-cols-3 gap-4 items-center">
                <div className="font-semibold text-lg">{diff.label}</div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-sm">{diff.granula}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Others: {diff.others}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-primary/10 rounded-xl p-8 max-w-2xl">
            <p className="text-lg font-semibold mb-2">Trusted by Leading Organizations</p>
            <p className="text-muted-foreground">
              University of Lagos • Andela • Co-Creation Hub • Flutterwave • TechCabal • And 500+ SMEs across Africa
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
