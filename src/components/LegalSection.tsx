import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Shield, Lock, AlertTriangle } from "lucide-react";

export const LegalSection = () => {
  return (
    <section id="legal" className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4">Privacy & Compliance</h2>
            <p className="text-muted-foreground text-lg">
              Privacy-first. Riot-compliant. Your data, protected.
            </p>
          </div>

          <Alert className="border-primary/30 bg-card/50">
            <Shield className="h-5 w-5 text-primary" />
            <AlertTitle className="text-lg mb-2">Riot API Compliance</AlertTitle>
            <AlertDescription className="space-y-2 text-sm">
              <p>
                monad.passport is compliant with <a href="https://developer.riotgames.com/policies/general" target="_blank" rel="noopener noreferrer" className="text-primary underline">Riot Games API Terms</a> and <a href="https://www.riotgames.com/en/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-primary underline">Terms of Service</a>:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>We never redistribute raw Riot match data or proprietary assets</li>
                <li>Only derived, anonymized analytics are stored on-chain</li>
                <li>We respect rate limits and implement aggressive caching</li>
                <li>No claims of Riot endorsement or in-game monetary value</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass-card animate-fade-in-up hover:animate-pulse-glow" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-accent" />
                  On-Chain
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Identity registry</p>
                <p>✓ Rank summaries</p>
                <p>✓ Badge metadata</p>
                <p>✓ ZK proof anchors</p>
              </CardContent>
            </Card>

            <Card className="glass-card animate-fade-in-up hover:animate-pulse-glow" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Off-Chain
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>✗ Raw match timelines</p>
                <p>✗ PUUID identifiers</p>
                <p>✗ Riot assets</p>
                <p>✗ Personal info</p>
              </CardContent>
            </Card>
          </div>

          <Alert className="border-accent/30 bg-card/50">
            <Info className="h-5 w-5 text-accent" />
            <AlertTitle className="text-lg mb-2">User Consent & Privacy</AlertTitle>
            <AlertDescription className="text-sm">
              <p className="mb-2">
                Before linking your League account, you'll be presented with clear consent dialogs explaining:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>What data we fetch from Riot API (rank, stats, achievements)</li>
                <li>How we compute derived analytics</li>
                <li>What gets published on-chain vs. stored privately</li>
                <li>Your right to disconnect and request data deletion</li>
              </ul>
              <p className="mt-3">
                We use <strong>ZK proofs</strong> to let you verify claims like "I'm Diamond rank" without exposing your PUUID or match history.
              </p>
            </AlertDescription>
          </Alert>

          <Card className="glass-card border-primary/30">
            <CardHeader>
              <CardTitle>Important Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                • <strong>No Riot Endorsement:</strong> monad.passport is not endorsed by, affiliated with, or sponsored by Riot Games. 
                League of Legends and all related assets are property of Riot Games.
              </p>
              <p>
                • <strong>No In-Game Value:</strong> Badge NFTs and reputation points have no monetary or functional value within League of Legends. 
                They exist purely on-chain as digital collectibles and reputation markers.
              </p>
              <p>
                • <strong>Virtual Content License:</strong> Per Riot's TOS, virtual game content is a license that can be revoked. 
                Our platform respects this by not claiming ownership of game assets.
              </p>
              <p>
                • <strong>Data Accuracy:</strong> While we strive for accuracy, derived analytics are computed from Riot API data and may have delays or discrepancies.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
