import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, AlertTriangle, Eye, Database, FileCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const LegalSection = () => {
  return (
    <section id="legal" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-semibold">Privacy & Compliance</span>
            </div>
            <h2 className="text-5xl font-bold mb-4 glow-text">
              Your Data, Secured
            </h2>
            <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
              Privacy-first. Riot-compliant. Fully transparent about what we store and how we protect it.
            </p>
          </div>

          {/* Riot Compliance Card */}
          <Card className="glass-card border-primary/30 animate-fade-in-up">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Riot Games API Compliance</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Fully compliant with{" "}
                    <a 
                      href="https://developer.riotgames.com/policies/general" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline"
                    >
                      Riot API Terms
                    </a>
                    {" "}and{" "}
                    <a 
                      href="https://www.riotgames.com/en/terms-of-service" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline"
                    >
                      ToS
                    </a>
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50">
                  <FileCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm mb-1">No Raw Data Redistribution</p>
                    <p className="text-xs text-muted-foreground">We never share raw match data or Riot assets</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50">
                  <Database className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm mb-1">Derived Analytics Only</p>
                    <p className="text-xs text-muted-foreground">Only anonymized, computed stats stored on-chain</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50">
                  <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm mb-1">Rate Limit Compliance</p>
                    <p className="text-xs text-muted-foreground">Aggressive caching and respectful API usage</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50">
                  <Eye className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm mb-1">No False Claims</p>
                    <p className="text-xs text-muted-foreground">No endorsement claims or in-game value promises</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Storage Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-card border-accent/30 animate-fade-in-up hover:border-accent/50 transition-colors" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-lg bg-accent/20">
                    <Lock className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">On-Chain Data</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">Public, immutable, verifiable</p>
              </CardHeader>
              <Separator className="mb-4" />
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-sm">Identity registry & wallet links</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-sm">Aggregated rank summaries</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-sm">Badge metadata & achievements</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/5">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-sm">Zero-knowledge proof anchors</span>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-destructive/30 animate-fade-in-up hover:border-destructive/50 transition-colors" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-lg bg-destructive/20">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                  </div>
                  <CardTitle className="text-2xl">Never Stored</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">Private, protected, off-chain</p>
              </CardHeader>
              <Separator className="mb-4" />
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-sm">Raw match timelines or replays</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-sm">PUUID or sensitive identifiers</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-sm">Riot proprietary assets or images</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/5">
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                  <span className="text-sm">Personal information or PII</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Consent Card */}
          <Card className="glass-card border-border/50 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-muted">
                  <Eye className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Your Control & Consent</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Full transparency before you link your account
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Before linking your League account, we'll clearly explain:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm">What data we fetch from Riot's API</span>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm">How we compute analytics</span>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm">What goes on-chain vs. private</span>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span className="text-sm">Your right to disconnect & delete</span>
                  </div>
                </div>
                <Separator />
                <p className="text-sm text-muted-foreground">
                  We never sell data to third parties and fully comply with GDPR data deletion requests. Your privacy is non-negotiable.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Footer Disclaimer */}
          <div className="text-center pt-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="max-w-3xl mx-auto p-6 rounded-lg bg-muted/20 border border-border/30">
              <p className="text-xs text-muted-foreground leading-relaxed">
                monad.passport is not endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games 
                or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games 
                are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
