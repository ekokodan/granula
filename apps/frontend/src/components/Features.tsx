import { Sparkles, Wifi, Coins, Globe, Users } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI Task Extraction",
      description: "Drop in notes, voice memos, or chat screenshots. AI automatically extracts and organizes your tasks.",
      gradient: "from-primary to-primary-glow"
    },
    {
      icon: Wifi,
      title: "True Offline Mode",
      description: "Work anywhere, anytime. All features available offline, syncs automatically when connected.",
      gradient: "from-accent to-orange-600"
    },
    {
      icon: Coins,
      title: "Local Currency Billing",
      description: "Pay in Naira, Cedis, Shillings, or other local currencies. No dollar conversion surprises.",
      gradient: "from-primary to-emerald-600"
    },
    {
      icon: Globe,
      title: "Your Language, Your Way",
      description: "English, Pidgin, Swahili, Yoruba, and more. Communicate naturally with AI assistance.",
      gradient: "from-accent to-red-500"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share tasks, set reminders, and collaborate with your team or study group effortlessly.",
      gradient: "from-primary to-teal-500"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built for <span className="text-primary">Real African Needs</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Features designed around the challenges you face every day
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card p-8 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-soft animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
