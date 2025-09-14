import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Shield, 
  Users, 
  Globe, 
  Award, 
  Heart, 
  CheckCircle,
  Star,
  MapPin,
  TrendingUp
} from "lucide-react";

export default function About() {
  const stats = [
    { label: "Students Helped", value: "10,000+", icon: Users },
    { label: "Properties Listed", value: "5,000+", icon: MapPin },
    { label: "Countries Served", value: "15+", icon: Globe },
    { label: "Average Rating", value: "4.8★", icon: Star },
  ];

  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description: "Every property is personally verified by our team to ensure student safety and quality standards."
    },
    {
      icon: Heart,
      title: "Student-Focused",
      description: "We understand student needs and budget constraints, offering flexible payment plans and affordable options."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting students worldwide with quality accommodation across Africa and internationally."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to providing the best possible experience for both students and property owners."
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former international student with a passion for solving housing challenges.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b742?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Tech expert focused on building secure and scalable platform solutions.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Amara Okafor",
      role: "Head of Operations",
      bio: "Operations specialist ensuring smooth experiences across all markets.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face"
    }
  ];

  const milestones = [
    { year: "2020", event: "VYNESTO founded with a mission to revolutionize student housing" },
    { year: "2021", event: "Launched in South Africa, serving 1,000+ students" },
    { year: "2022", event: "Expanded to Nigeria, Kenya, and Ghana" },
    { year: "2023", event: "Reached 10,000+ students across 15 countries" },
    { year: "2024", event: "Introduced advanced booking system and payment solutions" }
  ];

  return (
    <div data-testid="page-about">
      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')",
        }}
        data-testid="about-hero"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="about-title">
              Empowering Students
              <span className="text-accent"> Worldwide</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100" data-testid="about-subtitle">
              We're on a mission to make quality student housing accessible, affordable, and safe for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center" data-testid={`stat-${index}`}>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2" data-testid={`stat-value-${index}`}>
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground" data-testid={`stat-label-${index}`}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16" data-testid="story-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6" data-testid="story-title">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p data-testid="story-paragraph-1">
                  VYNESTO was born from the personal experience of struggling to find safe, affordable 
                  student accommodation. As international students ourselves, we understood the challenges 
                  of navigating unfamiliar housing markets, dealing with unverified properties, and 
                  managing complex payment processes.
                </p>
                <p data-testid="story-paragraph-2">
                  We realized that students needed a platform that not only connects them with quality 
                  housing but also provides the security, transparency, and support they deserve. That's 
                  why we created VYNESTO - a comprehensive solution that puts student needs first.
                </p>
                <p data-testid="story-paragraph-3">
                  Today, we're proud to serve thousands of students across multiple countries, helping 
                  them find their perfect home away from home while supporting property owners in 
                  building sustainable rental businesses.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Students collaborating"
                className="rounded-2xl shadow-lg"
                data-testid="story-image"
              />
              <div className="absolute -bottom-6 -right-6 bg-accent p-4 rounded-lg shadow-lg">
                <div className="text-accent-foreground font-semibold">Trusted by</div>
                <div className="text-2xl font-bold text-accent-foreground">10,000+ Students</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-secondary" data-testid="values-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="values-title">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="values-subtitle">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center" data-testid={`value-${index}`}>
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-3" data-testid={`value-title-${index}`}>
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground" data-testid={`value-description-${index}`}>
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16" data-testid="team-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="team-title">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="team-subtitle">
              Passionate individuals dedicated to transforming student housing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center" data-testid={`team-member-${index}`}>
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    data-testid={`team-member-image-${index}`}
                  />
                  <h3 className="text-xl font-semibold text-card-foreground mb-1" data-testid={`team-member-name-${index}`}>
                    {member.name}
                  </h3>
                  <Badge variant="secondary" className="mb-3" data-testid={`team-member-role-${index}`}>
                    {member.role}
                  </Badge>
                  <p className="text-muted-foreground" data-testid={`team-member-bio-${index}`}>
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-secondary" data-testid="timeline-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="timeline-title">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="timeline-subtitle">
              Key milestones in our mission to transform student housing
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-4" data-testid={`milestone-${index}`}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-card rounded-lg p-4 shadow-sm">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge className="bg-accent/10 text-accent" data-testid={`milestone-year-${index}`}>
                        {milestone.year}
                      </Badge>
                    </div>
                    <p className="text-card-foreground" data-testid={`milestone-event-${index}`}>
                      {milestone.event}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6" data-testid="cta-title">
            Join Our Mission
          </h2>
          <p className="text-xl mb-8 opacity-90" data-testid="cta-subtitle">
            Whether you're a student looking for housing or a property owner wanting to help, 
            we'd love to have you as part of the VYNESTO community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                data-testid="cta-find-housing"
              >
                Find Housing
              </Button>
            </Link>
            <Link href="/list-property">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold"
                data-testid="cta-list-property"
              >
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
