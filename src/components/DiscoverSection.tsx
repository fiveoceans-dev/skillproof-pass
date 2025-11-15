import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, TrendingUp, Users, Zap, Shield } from "lucide-react";

export const DiscoverSection = () => {
  const benefits = [
    {
      icon: Trophy,
      title: "Prove Your Victories",
      description: "Showcase your wins against high-tier opponents. Every victory over Platinum+ players becomes verified proof of your skills.",
      color: "text-primary"
    },
    {
      icon: Target,
      title: "Verify Your Skills",
      description: "Your mechanics, game sense, and decision-making are quantified and cryptographically secured. No more empty claims.",
      color: "text-accent"
    },
    {
      icon: TrendingUp,
      title: "Display Your Rank",
      description: "Your current and peak rankings are permanently recorded. Show your climb from Bronze to Diamond with immutable proof.",
      color: "text-rank"
    },
    {
      icon: Users,
      title: "Competitive Credibility",
      description: "Stand out in team recruitment, tournaments, or coaching applications with verified performance data.",
      color: "text-badge"
    },
    {
      icon: Zap,
      title: "Live Game Stats",
      description: "KDA, win rates, champion mastery, and clutch plays - all validated through blockchain verification.",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "You control what's shared. Only aggregated, derived stats go on-chain. Raw match data stays private.",
      color: "text-accent"
    }
  ];

  return (
    <section id="discover" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center animate-fade-in-up">
            <h2 className="text-5xl font-bold mb-4 glow-text">
              Why Open Your monad.passport?
            </h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Transform your League of Legends achievements into verifiable credentials. 
              Your skills, your stats, your proof - secured on blockchain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={index}
                  className="glass-card animate-fade-in-up hover:animate-pulse-glow border-border/50 hover:border-primary/30 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-3 rounded-lg bg-card/80 ${benefit.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center animate-fade-in-up pt-8" style={{ animationDelay: '0.6s' }}>
            <div className="glass-card max-w-4xl mx-auto p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Real Skills. Real Proof. Real Recognition.
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you're applying for esports teams, coaching others, or simply want to 
                preserve your competitive legacy - monad.passport gives you immutable, 
                verifiable proof of your League of Legends mastery. Link your account today 
                and turn your gaming achievements into portable credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
