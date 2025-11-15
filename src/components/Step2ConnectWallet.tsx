import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, Info } from "lucide-react";
import { WalletConnect } from "./WalletConnect";
import { useAccount } from "wagmi";

interface Step2Props {
  onComplete: () => void;
}

export function Step2ConnectWallet({ onComplete }: Step2Props) {
  const { isConnected } = useAccount();

  const handleContinue = () => {
    if (isConnected) {
      onComplete();
    }
  };

  return (
    <div className="animate-fade-in">
      <Card className="glass-card border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Connect Your Wallet
          </CardTitle>
          <CardDescription>
            Link your Web3 wallet on Monad Testnet to store verified player credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-primary/10 border-primary/30">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription>
              Connect with MetaMask, Coinbase Wallet, or WalletConnect to continue
            </AlertDescription>
          </Alert>

          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            {isConnected ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-semibold text-primary">Wallet Connected!</p>
                <p className="text-sm text-muted-foreground">
                  Click continue to proceed to the next step
                </p>
                <Button onClick={handleContinue} className="mt-4">
                  Continue to Step 3
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Wallet className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose your preferred wallet to connect
                </p>
                <WalletConnect />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
