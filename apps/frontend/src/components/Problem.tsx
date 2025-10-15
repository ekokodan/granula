import { MessageSquare, WifiOff, DollarSign } from "lucide-react";

export const Problem = () => {
  const problems = [
    {
      icon: MessageSquare,
      title: "Tasks Scattered Everywhere",
      description: "Important tasks lost across WhatsApp groups, spreadsheets, and sticky notes"
    },
    {
      icon: WifiOff,
      title: "Unreliable Internet",
      description: "Can't access your tasks when you need them most due to poor connectivity"
    },
    {
      icon: DollarSign,
      title: "Expensive Foreign Apps",
      description: "Paying in dollars for tools that don't understand local needs or payment methods"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Reality for <span className="text-primary">African Professionals</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You're juggling multiple tools, fighting poor internet, and paying premium prices for apps that don't fit your workflow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 bg-destructive/10 rounded-lg flex items-center justify-center mb-6">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};