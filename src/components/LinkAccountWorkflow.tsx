import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Link2, Info, Loader2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LinkedAccount {
  id: string;
  summoner_name: string;
  region: string;
  rank_tier: string | null;
  rank_division: string | null;
  verified: boolean;
  verification_code: string | null;
}

export const LinkAccountWorkflow = ({ userId }: { userId: string }) => {
  const [step, setStep] = useState(1);
  const [summonerName, setSummonerName] = useState("");
  const [region, setRegion] = useState("na1");
  const [loading, setLoading] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchLinkedAccounts();
  }, [userId]);

  const fetchLinkedAccounts = async () => {
    const { data, error } = await supabase
      .from("linked_accounts")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching linked accounts:", error);
      return;
    }

    setLinkedAccounts(data || []);
  };

  const handleLinkAccount = async () => {
    if (!summonerName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a summoner name",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("link-lol-account", {
        body: {
          summonerName: summonerName.trim(),
          region,
          userId,
        },
      });

      if (error) throw error;

      if (data.success) {
        setVerificationCode(data.verificationCode);
        setStep(2);
        toast({
          title: "Account found!",
          description: "Please verify your ownership by updating your icon.",
        });
        await fetchLinkedAccounts();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to link account",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAccount = async (accountId: string) => {
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("verify-lol-account", {
        body: {
          accountId,
          userId,
        },
      });

      if (error) throw error;

      if (data.success) {
        setStep(3);
        toast({
          title: "Verified!",
          description: "Your League account has been successfully linked.",
        });
        await fetchLinkedAccounts();
      } else {
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: data.message || "Could not verify account ownership",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to verify account",
      });
    } finally {
      setLoading(false);
    }
  };

  const regions = [
    { value: "na1", label: "North America" },
    { value: "euw1", label: "Europe West" },
    { value: "eun1", label: "Europe Nordic & East" },
    { value: "kr", label: "Korea" },
    { value: "br1", label: "Brazil" },
    { value: "la1", label: "Latin America North" },
    { value: "la2", label: "Latin America South" },
    { value: "oc1", label: "Oceania" },
    { value: "tr1", label: "Turkey" },
    { value: "ru", label: "Russia" },
    { value: "jp1", label: "Japan" },
  ];

  return (
    <div className="space-y-8">
      {/* Existing linked accounts */}
      {linkedAccounts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Your Linked Accounts</h3>
          {linkedAccounts.map((account) => (
            <Card key={account.id} className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">{account.summoner_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {regions.find((r) => r.value === account.region)?.label || account.region}
                    </p>
                    {account.rank_tier && (
                      <p className="text-sm text-primary mt-1">
                        {account.rank_tier} {account.rank_division}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {account.verified ? (
                      <div className="flex items-center gap-2 text-primary">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleVerifyAccount(account.id)}
                        disabled={loading}
                        size="sm"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "Verify Ownership"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                {!account.verified && account.verification_code && (
                  <Alert className="mt-4 bg-muted/50 border-accent/30">
                    <Info className="h-4 w-4 text-accent" />
                    <AlertDescription>
                      <p className="font-medium mb-2">Verification Code: {account.verification_code}</p>
                      <p className="text-sm">
                        Change your profile icon to icon #{account.verification_code} in League client, then click "Verify Ownership"
                      </p>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Progress steps */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className={`glass-card p-6 rounded-xl text-center transition-all ${step >= 1 ? 'border-primary' : ''}`}>
          <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4 font-bold">
            1
          </div>
          <h3 className="font-semibold mb-2">Enter Summoner Name</h3>
          {step > 1 && <CheckCircle2 className="h-5 w-5 text-primary mx-auto mt-3" />}
        </div>

        <div className={`glass-card p-6 rounded-xl text-center transition-all ${step >= 2 ? 'border-primary' : ''}`}>
          <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4 font-bold">
            2
          </div>
          <h3 className="font-semibold mb-2">Verify Ownership</h3>
          {step > 2 && <CheckCircle2 className="h-5 w-5 text-primary mx-auto mt-3" />}
        </div>

        <div className={`glass-card p-6 rounded-xl text-center transition-all ${step >= 3 ? 'border-primary' : ''}`}>
          <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-4 font-bold">
            3
          </div>
          <h3 className="font-semibold mb-2">Earn Badges</h3>
          {step > 3 && <CheckCircle2 className="h-5 w-5 text-primary mx-auto mt-3" />}
        </div>
      </div>

      {/* Link new account card */}
      <Card className="glass-card border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Link New League Account
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
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full h-10 px-3 rounded-md bg-background/50 border border-input focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={loading}
              >
                {regions.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleLinkAccount}
              disabled={loading || !summonerName.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                "Link Account"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
