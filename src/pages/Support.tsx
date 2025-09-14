import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  HelpCircle, 
  BookOpen, 
  Shield, 
  CreditCard,
  Home,
  Users,
  Clock,
  CheckCircle
} from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  category: z.enum(["general", "booking", "payment", "property", "technical", "account"], {
    required_error: "Please select a category"
  }),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Support() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement actual contact form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you within 24 hours.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7",
      action: "Start Chat",
      color: "bg-primary/10 text-primary"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message",
      availability: "Response within 24h",
      action: "Send Email",
      color: "bg-accent/10 text-accent"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      availability: "Mon-Fri, 9AM-6PM GMT",
      action: "Call Now",
      color: "bg-chart-3/10 text-chart-3"
    }
  ];

  const helpCategories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn how to use VYNESTO effectively",
      articles: 12
    },
    {
      icon: Home,
      title: "Finding Properties",
      description: "Tips for searching and booking accommodation",
      articles: 8
    },
    {
      icon: CreditCard,
      title: "Payments & Billing",
      description: "Understanding our payment system",
      articles: 6
    },
    {
      icon: Shield,
      title: "Safety & Security",
      description: "Staying safe while using our platform",
      articles: 10
    },
    {
      icon: Users,
      title: "For Property Owners",
      description: "Managing your property listings",
      articles: 15
    }
  ];

  const faqs = [
    {
      question: "How does VYNESTO verify properties?",
      answer: "Every property listed on VYNESTO undergoes a thorough verification process. Our team personally visits each property to ensure it meets our safety and quality standards. We check documentation, take photos, and verify all amenities listed."
    },
    {
      question: "Is my payment secure?",
      answer: "Yes, absolutely. We use industry-standard encryption and secure payment processing through Stripe. Your payment is held in escrow until your move-in date, providing protection for both students and property owners."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking within 24 hours of confirmation for a full refund. After 24 hours, cancellation terms depend on the property's policy and how far in advance you cancel."
    },
    {
      question: "What payment plans are available?",
      answer: "We offer flexible payment options including full payment (with 5% discount), monthly payments, semester payments, and student loan assistance. Choose the option that works best for your budget."
    },
    {
      question: "How do I contact a property owner?",
      answer: "Once you've made a booking inquiry or reservation, you can message the property owner directly through our secure messaging system. This protects both parties and keeps all communication in one place."
    },
    {
      question: "What if I have issues with my accommodation?",
      answer: "Contact our support team immediately if you experience any issues. We have dedicated staff to resolve disputes and ensure both students and property owners have a positive experience."
    },
    {
      question: "How do I list my property?",
      answer: "Property owners can list their properties by creating an owner account and following our simple listing process. All properties are reviewed within 24-48 hours before going live on the platform."
    },
    {
      question: "Are there fees for using VYNESTO?",
      answer: "For students, there's a small platform fee added to bookings. For property owners, we charge a commission only when a successful booking is made. There are no upfront listing fees."
    }
  ];

  return (
    <div data-testid="page-support">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16" data-testid="support-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="support-title">
            How Can We Help You?
          </h1>
          <p className="text-xl mb-8 text-primary-foreground/90" data-testid="support-subtitle">
            Get the support you need to make the most of your VYNESTO experience
          </p>
          
          {/* Quick Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search for help articles, FAQs, and guides..."
                className="pl-10 py-4 text-lg"
                data-testid="search-help"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16" data-testid="contact-methods-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="contact-methods-title">
              Get In Touch
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="contact-methods-subtitle">
              Choose the best way to reach our support team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow" data-testid={`contact-method-${index}`}>
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${method.color}`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-2" data-testid={`contact-method-title-${index}`}>
                      {method.title}
                    </h3>
                    <p className="text-muted-foreground mb-3" data-testid={`contact-method-description-${index}`}>
                      {method.description}
                    </p>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground" data-testid={`contact-method-availability-${index}`}>
                        {method.availability}
                      </span>
                    </div>
                    <Button className="w-full" data-testid={`contact-method-action-${index}`}>
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Form */}
          <Card className="max-w-2xl mx-auto" data-testid="contact-form-card">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      data-testid="contact-name"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive mt-1" data-testid="error-name">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      data-testid="contact-email"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-destructive mt-1" data-testid="error-email">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Category *</Label>
                  <Select onValueChange={(value) => form.setValue("category", value as any)}>
                    <SelectTrigger data-testid="contact-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="booking">Booking Support</SelectItem>
                      <SelectItem value="payment">Payment Issues</SelectItem>
                      <SelectItem value="property">Property Questions</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="account">Account Issues</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-sm text-destructive mt-1" data-testid="error-category">
                      {form.formState.errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    {...form.register("subject")}
                    data-testid="contact-subject"
                  />
                  {form.formState.errors.subject && (
                    <p className="text-sm text-destructive mt-1" data-testid="error-subject">
                      {form.formState.errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your question or issue in detail..."
                    className="min-h-[120px]"
                    {...form.register("message")}
                    data-testid="contact-message"
                  />
                  {form.formState.errors.message && (
                    <p className="text-sm text-destructive mt-1" data-testid="error-message">
                      {form.formState.errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  data-testid="submit-contact-form"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-secondary" data-testid="help-categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="help-categories-title">
              Browse Help Topics
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="help-categories-subtitle">
              Find answers in our comprehensive help center
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {helpCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" data-testid={`help-category-${index}`}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2" data-testid={`help-category-title-${index}`}>
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground mb-3" data-testid={`help-category-description-${index}`}>
                      {category.description}
                    </p>
                    <Badge variant="secondary" data-testid={`help-category-articles-${index}`}>
                      {category.articles} articles
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16" data-testid="faq-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="faq-title">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="faq-subtitle">
              Quick answers to common questions
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4" data-testid="faq-accordion">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left" data-testid={`faq-question-${index}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-4" data-testid={`faq-answer-${index}`}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for?
            </p>
            <Button variant="outline" data-testid="contact-support-button">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="py-16 bg-secondary" data-testid="status-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-6 h-6 text-chart-3 mr-2" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between p-4 bg-chart-3/5 rounded-lg">
                  <span className="font-medium">Platform</span>
                  <Badge className="bg-chart-3/10 text-chart-3">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-chart-3/5 rounded-lg">
                  <span className="font-medium">Payments</span>
                  <Badge className="bg-chart-3/10 text-chart-3">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-chart-3/5 rounded-lg">
                  <span className="font-medium">Support</span>
                  <Badge className="bg-chart-3/10 text-chart-3">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Available
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                All systems operational • Last updated: Just now
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
