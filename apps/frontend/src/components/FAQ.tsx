import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ = () => {
  const faqs = [
    {
      question: "Can Granula work without internet connection?",
      answer: "Yes! Granula is built with offline-first functionality. You can create, edit, and manage all your tasks without internet. Changes sync automatically when you're back online."
    },
    {
      question: "How much does Granula cost in Naira?",
      answer: "Our Student plan starts at ₦1,500/month, Professional at ₦3,500/month, and Business at ₦8,000/month. We also accept Cedis, Shillings, and other local currencies. Early adopters get 3 months free!"
    },
    {
      question: "Is my data safe and private?",
      answer: "Absolutely. We use bank-grade encryption for all data. Your information is stored securely and never shared with third parties. We comply with international data protection standards including GDPR."
    },
    {
      question: "Can I use Granula with my team or study group?",
      answer: "Yes! Professional and Business plans include team collaboration features. Share tasks, set group reminders, and track progress together. Perfect for study groups, project teams, or SMEs."
    },
    {
      question: "What languages and dialects does Granula support?",
      answer: "Currently, we support English, Nigerian Pidgin, Swahili, Yoruba, Igbo, and Hausa. We're actively adding more African languages and dialects based on user requests."
    },
    {
      question: "How does the AI task extraction work?",
      answer: "Simply paste text, upload voice notes, or screenshot WhatsApp chats. Our AI automatically identifies tasks, deadlines, and priorities. You can then organize, edit, or schedule them with one tap."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept mobile money (M-Pesa, MTN MoMo, etc.), local bank cards, bank transfers, and cash payments through our partners. No international card required!"
    },
    {
      question: "When will Granula be available?",
      answer: "We're launching in Q2 2025! Join our waitlist to get early access, exclusive benefits, and 3 months of free Premium when we launch."
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about Granula
          </p>
        </div>

        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card px-6 mb-4 rounded-xl border border-border animate-fade-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <AccordionTrigger className="text-left hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
