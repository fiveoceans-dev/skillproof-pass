import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Gamepad2, Info, Loader2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LinkedAccountCard } from "./LinkedAccountCard";
import { VerificationModal } from "./VerificationModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LinkedAccount {
  id: string;
  summoner_name: string | null;
  game_name: string | null;
  tag_line: string | null;
  region: string;
  rank_tier: string | null;
  rank_division: string | null;
  verified: boolean;
  verification_code: string | null;
}

interface Step1Props {
  userId: string;
  onComplete: () => void;
}

export function Step1LinkAccount({ userId, onComplete }: Step1Props) {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [region, setRegion] = useState("na1");
  const [loading, setLoading] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [currentVerificationCode, setCurrentVerificationCode] = useState("");
  const [currentAccountId, setCurrentAccountId] = useState("");
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

  const handleStartVerification = async () => {
    if (!gameName.trim() || !tagLine.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter both game name and tagline",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("link-lol-account", {
        body: {
          gameName: gameName.trim(),
          tagLine: tagLine.trim(),
          region,
          userId,
        },
      });

      if (error) throw error;

      if (data.success) {
        setCurrentVerificationCode(data.verificationCode);
        setCurrentAccountId(data.accountId);
        setShowVerificationModal(true);
        toast({
          title: "Account found!",
          description: "Please verify your ownership by updating your profile icon.",
        });
        await fetchLinkedAccounts();
        setGameName("");
        setTagLine("");
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

  const handleVerify = async (accountId?: string) => {
    const idToVerify = accountId || currentAccountId;
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("verify-lol-account", {
        body: {
          accountId: idToVerify,
          userId,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Verified!",
          description: "Your League account has been successfully verified.",
        });
        setShowVerificationModal(false);
        await fetchLinkedAccounts();
        onComplete(); // Complete step after successful verification
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

  const handleUnlink = async (accountId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("linked_accounts")
        .delete()
        .eq("id", accountId);

      if (error) throw error;

      toast({
        title: "Account unlinked",
        description: "The account has been removed.",
      });
      await fetchLinkedAccounts();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to unlink account",
      });
    } finally {
      setLoading(false);
    }
  };

  const regions = [
    { value: "na1", label: "North America" },
    { value: "euw1", label: "Europe West" },
    { value: "eune1", label: "Europe Nordic & East" },
    { value: "kr", label: "Korea" },
    { value: "br1", label: "Brazil" },
    { value: "la1", label: "Latin America North" },
    { value: "la2", label: "Latin America South" },
    { value: "oc1", label: "Oceania" },
    { value: "ru", label: "Russia" },
    { value: "tr1", label: "Turkey" },
    { value: "jp1", label: "Japan" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-card border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            Link Your League Account
          </CardTitle>
          <CardDescription>
            Connect your League of Legends account to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-primary/10 border-primary/30">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription>
              <strong>Privacy First:</strong> Only derived analytics stored on-chain, never raw match data.
            </AlertDescription>
          </Alert>

          {linkedAccounts.length > 0 && (
            <div className="space-y-3">
              <Label>Your Linked Accounts</Label>
              {linkedAccounts.map((account) => (
                <LinkedAccountCard
                  key={account.id}
                  account={account}
                  onVerify={handleVerify}
                  onUnlink={handleUnlink}
                  isLoading={loading}
                />
              ))}
            </div>
          )}

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Plus className="h-4 w-4 text-primary" />
              <Label>Add New Account</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gameName">Game Name</Label>
                <Input
                  id="gameName"
                  placeholder="GameName"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagLine">Tagline</Label>
                <Input
                  id="tagLine"
                  placeholder="#NA1"
                  value={tagLine}
                  onChange={(e) => setTagLine(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select value={region} onValueChange={setRegion} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleStartVerification}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Starting...
                </>
              ) : (
                "Start Verification"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        verificationCode={currentVerificationCode}
        onVerify={() => handleVerify()}
        isVerifying={loading}
      />
    </div>
  );
}
