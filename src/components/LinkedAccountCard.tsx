import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Trash2 } from "lucide-react";

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

interface LinkedAccountCardProps {
  account: LinkedAccount;
  onVerify: (accountId: string) => void;
  onUnlink: (accountId: string) => void;
  isLoading: boolean;
}

export function LinkedAccountCard({ account, onVerify, onUnlink, isLoading }: LinkedAccountCardProps) {
  const displayName = account.game_name 
    ? `${account.game_name}#${account.tag_line}` 
    : account.summoner_name || "Unknown";
  
  const rank = account.rank_tier && account.rank_division
    ? `${account.rank_tier} ${account.rank_division}`
    : "Unranked";

  return (
    <Card className="glass-card border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold">{displayName}</p>
              {account.verified ? (
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="border-muted-foreground/30">
                  <XCircle className="h-3 w-3 mr-1" />
                  Not Verified
                </Badge>
              )}
            </div>
            <div className="flex gap-3 text-sm text-muted-foreground">
              <span>{account.region.toUpperCase()}</span>
              <span>•</span>
              <span>{rank}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {!account.verified && account.verification_code && (
              <Button
                onClick={() => onVerify(account.id)}
                disabled={isLoading}
                size="sm"
              >
                Verify
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onUnlink(account.id)}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
