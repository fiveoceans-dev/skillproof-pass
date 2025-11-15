import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Link2, Shield, Info } from "lucide-react";
import { useState } from "react";

export const AccountLinkSection = () => {
  const [step, setStep] = useState(1);
  const [summonerName, setSummonerName] = useState("");

  return (
    <section id="how-it-works" className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4">Link Your Account</h2>
            <p className="text-muted-foreground text-lg">
              Connect League of Legends. Build on-chain reputation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className={`glass-card p-6 rounded-xl text-center transition-all animate-fade-in-up ${step >= 1 ? 'border-primary' : ''}`} style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Connect Wallet</h3>
              {step > 1 && <CheckCircle2 className="h-5 w-5 text-primary mx-auto mt-3" />}
            </div>

            <div className={`glass-card p-6 rounded-xl text-center transition-all animate-fade-in-up ${step >= 2 ? 'border-primary' : ''}`} style={{ animationDelay: '0.4s' }}>
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Verify Ownership</h3>
              {step > 2 && <CheckCircle2 className="h-5 w-5 text-primary mx-auto mt-3" />}
            </div>

            <div className={`glass-card p-6 rounded-xl text-center transition-all animate-fade-in-up ${step >= 3 ? 'border-primary' : ''}`} style={{ animationDelay: '0.6s' }}>
              <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Start Earning</h3>
              {step > 3 && <CheckCircle2 className="h-5 w-5 text-primary mx-auto mt-3" />}
            </div>
          </div>

          <Card className="glass-card border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                Link League Account
              </CardTitle>
              <CardDescription>
                Enter your summoner name to begin the verification process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-muted/50 border-accent/30">
                <Info className="h-4 w-4 text-accent" />
                <AlertDescription>
                  <strong>Privacy First:</strong> Only derived analytics on-chain, never raw match data.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="summoner">Summoner Name</Label>
                  <Input 
                    id="summoner"
                    placeholder="Enter your summoner name"
                    value={summonerName}
                    onChange={(e) => setSummonerName(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <select 
                    id="region"
                    className="w-full h-10 rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                  >
                    <option>North America</option>
                    <option>Europe West</option>
                    <option>Europe Nordic & East</option>
                    <option>Korea</option>
                    <option>Latin America</option>
                    <option>Brazil</option>
                    <option>Oceania</option>
                    <option>Turkey</option>
                    <option>Russia</option>
                    <option>Japan</option>
                  </select>
                </div>

                <Alert className="bg-card border-border">
                  <Shield className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    By linking your account, you consent to:<br/>
                    • Fetching your rank & achievement data from Riot API<br/>
                    • Storing derived analytics (no raw match data)<br/>
                    • Minting on-chain credentials tied to your wallet
                  </AlertDescription>
                </Alert>

                <Button variant="hero" className="w-full" size="lg">
                  Link Account & Verify
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
