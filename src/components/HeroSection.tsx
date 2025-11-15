import { Button } from "@/components/ui/button";
import { Shield, Coins, Award, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-primary/30">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Powered by Monad & ZK Proofs</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight animate-fade-in-up">
            Prove Your{" "}
            <span className="text-primary glow-text">Rank</span>
            <br />
            Own Your{" "}
            <span className="text-accent">Legacy</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Verifiable on-chain credentials. Privacy-first ZK proofs. Your skill, immortalized.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button variant="hero" size="xl" onClick={() => navigate("/auth")}>
              Connect & Link Account
            </Button>
            <Button variant="outline" size="xl" onClick={() => navigate("/dashboard")}>
              View Dashboard
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="glass-card p-6 rounded-xl space-y-3 hover:border-primary/50 transition-all animate-fade-in-up animate-float" style={{ animationDelay: '0.4s' }}>
              <Award className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold text-lg">Badge NFTs</h3>
              <p className="text-sm text-muted-foreground">
                Mint verifiable achievements
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl space-y-3 hover:border-accent/50 transition-all animate-fade-in-up animate-float" style={{ animationDelay: '0.6s', animationDuration: '7s' }}>
              <Zap className="h-8 w-8 text-accent mx-auto" />
              <h3 className="font-semibold text-lg">ZK Privacy</h3>
              <p className="text-sm text-muted-foreground">
                Prove rank privately
              </p>
            </div>

            <div className="glass-card p-6 rounded-xl space-y-3 hover:border-primary/50 transition-all animate-fade-in-up animate-float" style={{ animationDelay: '0.8s', animationDuration: '8s' }}>
              <Coins className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold text-lg">Tokenized Points</h3>
              <p className="text-sm text-muted-foreground">
                Earn reputation on-chain
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
