import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Info, Loader2, CheckCircle2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import badgeIcon from "@/assets/badge-icon.png";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useChainId, useSwitchChain } from "wagmi";
import { supabase } from "@/integrations/supabase/client";
import { parseEther, encodeFunctionData, keccak256, toHex } from "viem";
import { monadTestnet } from "@/lib/wagmi-config";

interface Step3Props {
  canProceed: boolean;
}

export function Step3SaveToBlockchain({ canProceed }: Step3Props) {
  const [storeAchievements, setStoreAchievements] = useState(true);
  const [mintNFT, setMintNFT] = useState(true);
  const [generateZK, setGenerateZK] = useState(false);
  const [success, setSuccess] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [attempted, setAttempted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { data: hash, isPending, sendTransaction } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Update transaction hash and success state when transaction is confirmed
  useEffect(() => {
    if (isConfirmed && hash) {
      console.log('✅ Transaction confirmed on Monad testnet:', hash);
      setTransactionHash(hash);
      setSuccess(true);
      toast({
        title: "Success!",
        description: "Your credentials are now stored on Monad Testnet.",
      });
    }
  }, [isConfirmed, hash, toast]);

  // Log transaction status changes
  useEffect(() => {
    if (hash) {
      console.log('📝 Transaction hash received:', hash);
      console.log('⏳ Waiting for confirmation...');
    }
  }, [hash]);

  useEffect(() => {
    if (isConfirming) {
      console.log('⏳ Transaction is being confirmed...');
    }
  }, [isConfirming]);

  const handleSaveToBlockchain = async () => {
    if (!address) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please connect your wallet first",
      });
      return;
    }

    setAttempted(true);
    setErrorMsg(null);

    // Ensure wallet is on Monad Testnet (force-check by requesting a switch)
    try {
      const before = (window as any)?.ethereum?.chainId;
      console.log('🔁 Ensuring Monad chain. App chainId:', chainId, 'Wallet chainId:', before, 'Target:', monadTestnet.id);
      await switchChainAsync({ chainId: monadTestnet.id });
      // Give wallet/provider a brief moment to settle
      await new Promise((r) => setTimeout(r, 400));
      const after = (window as any)?.ethereum?.chainId;
      console.log('✅ Chain ready. Wallet chainId after switch:', after);
    } catch (e: any) {
      console.error('❌ Could not switch to Monad Testnet:', e);
      setErrorMsg(`Please switch your wallet to ${monadTestnet.name} (chain ${monadTestnet.id}) and try again.`);
      toast({
        variant: 'destructive',
        title: 'Network Switch Required',
        description: e?.message || `Switch to ${monadTestnet.name} in your wallet and retry.`,
      });
      setAttempted(false);
      return;
    }

    try {
      // Fetch user's verified linked accounts
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: linkedAccounts, error } = await supabase
        .from("linked_accounts")
        .select("*")
        .eq("user_id", user.id)
        .eq("verified", true);

      if (error) throw error;
      if (!linkedAccounts || linkedAccounts.length === 0) {
        throw new Error("No verified accounts found");
      }

      // Create a hash of the credentials data
      const credentialsData = {
        accounts: linkedAccounts.map(acc => ({
          gameName: acc.game_name,
          tagLine: acc.tag_line,
          region: acc.region,
          rank: `${acc.rank_tier} ${acc.rank_division}`,
        })),
        timestamp: Date.now(),
        walletAddress: address,
      };

      // Hash the credentials
      const dataString = JSON.stringify(credentialsData);
      const dataHash = keccak256(toHex(dataString));

      console.log('🚀 Preparing transaction to Monad testnet:', {
        chainId: monadTestnet.id,
        chainName: monadTestnet.name,
        to: address,
        credentialsHash: dataHash,
        accounts: linkedAccounts.length
      });

      console.log('📤 Calling sendTransaction - this should open your wallet...');
      
      // Send real transaction to Monad testnet with credentials hash in data field
      const result = sendTransaction(
        {
          to: address, // Send to self to store data on-chain
          value: parseEther('0'), // No value transfer, just data storage
          data: dataHash, // Store credentials hash in transaction data
        },
        {
          onSuccess: (hash) => {
            console.log('✅ Transaction sent successfully, hash:', hash);
          },
          onError: (error) => {
            console.error('❌ Transaction failed:', error);
            setErrorMsg(error.message || 'Transaction failed');
            toast({
              variant: 'destructive',
              title: 'Transaction Failed',
              description: error.message || 'Failed to send transaction',
            });
          },
        }
      );

      console.log('📝 sendTransaction result:', result);

      toast({
        title: "Check Your Wallet",
        description: "Please confirm the transaction in your wallet popup",
      });

    } catch (error: any) {
      console.error('❌ Error preparing transaction:', error);
      setErrorMsg(error?.message || 'Failed to save credentials');
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save credentials",
      });
    }
  };

  if (!canProceed) {
    return (
      <div className="animate-fade-in">
        <Card className="glass-card border-muted opacity-50">
          <CardContent className="p-12 text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold text-muted-foreground mb-2">
              Complete Previous Steps
            </p>
            <p className="text-sm text-muted-foreground">
              Link your game account and connect your wallet to continue
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    const explorerUrl = `${monadTestnet.blockExplorers.default.url}/tx/${transactionHash}`;
    
    return (
      <div className="animate-fade-in">
        <Card className="glass-card border-primary/30">
          <CardContent className="p-12 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary mb-2">Credentials Saved!</p>
              <p className="text-muted-foreground mb-4">
                Your verified League credentials are now stored on Monad Testnet
              </p>
              <div className="bg-muted/50 rounded-lg p-4 mt-4">
                <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                <p className="text-sm font-mono break-all">{transactionHash}</p>
              </div>
            </div>
            <div className="flex gap-2 justify-center flex-wrap">
              <Button 
                variant="outline" 
                onClick={() => {
                  navigator.clipboard.writeText(transactionHash);
                  toast({
                    title: "Copied!",
                    description: "Transaction hash copied to clipboard",
                  });
                }}
              >
                Copy Hash
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open(explorerUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </Button>
              <Button variant="outline" onClick={() => setSuccess(false)}>
                Save Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <Card className="glass-card border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Save to Monad
          </CardTitle>
          <CardDescription>
            Store privacy-preserving analytics on the Monad blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-primary/10 border-primary/30">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription>
              We only store achievement proofs and analytics, never raw match data or personal information.
            </AlertDescription>
          </Alert>

          <Alert className="bg-muted/50 border-muted">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              This will send a real transaction to Monad testnet. You'll need to confirm it in your wallet and pay a small gas fee.
            </AlertDescription>
          </Alert>

          {chainId !== monadTestnet.id && (
            <Alert className="bg-destructive/10 border-destructive/30">
              <Info className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-sm flex items-center justify-between gap-3">
                <span>
                  You're on the wrong network (chain {chainId}). Switch to {monadTestnet.name} (ID {monadTestnet.id}) to continue.
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    try {
                      await switchChainAsync({ chainId: monadTestnet.id });
                      toast({ title: "Network Switched", description: `Switched to ${monadTestnet.name}` });
                    } catch (e: any) {
                      toast({ variant: "destructive", title: "Switch Failed", description: e?.message || 'Please switch network in your wallet' });
                    }
                  }}
                >
                  {isSwitching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Switching...
                    </>
                  ) : (
                    'Switch to Monad'
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-center py-6">
            <div className="relative">
              <img
                src={badgeIcon}
                alt="Skill Badge NFT"
                className="w-48 h-48 rounded-lg shadow-lg"
              />
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">NFT</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-semibold text-sm">What would you like to save?</p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <Checkbox
                  id="achievements"
                  checked={storeAchievements}
                  onCheckedChange={(checked) => setStoreAchievements(checked as boolean)}
                />
                <label
                  htmlFor="achievements"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Store achievement proofs
                </label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <Checkbox
                  id="nft"
                  checked={mintNFT}
                  onCheckedChange={(checked) => setMintNFT(checked as boolean)}
                />
                <label
                  htmlFor="nft"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Mint skill badge NFT
                </label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <Checkbox
                  id="zk"
                  checked={generateZK}
                  onCheckedChange={(checked) => setGenerateZK(checked as boolean)}
                />
                <label
                  htmlFor="zk"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Generate ZK proof (optional)
                </label>
              </div>
            </div>
          </div>

          {/* Transaction Steps */}
          <section className="space-y-3">
            <p className="font-semibold text-sm">Transaction status</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                {(attempted || isPending || hash || isConfirming || success) ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Loader2 className="h-4 w-4 text-muted-foreground" />
                )}
                Prepare data
              </li>
              <li className="flex items-center gap-2 text-sm">
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : attempted ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Loader2 className="h-4 w-4 text-muted-foreground" />
                )}
                Confirm in wallet
              </li>
              <li className="flex items-center gap-2 text-sm">
                {hash ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Loader2 className="h-4 w-4 text-muted-foreground" />
                )}
                Submitted {hash && (
                  <button onClick={() => window.open(`${monadTestnet.blockExplorers.default.url}/tx/${hash}`, '_blank')} className="text-primary underline underline-offset-2 ml-2 flex items-center">
                    View on explorer <ExternalLink className="h-3 w-3 ml-1" />
                  </button>
                )}
              </li>
              <li className="flex items-center gap-2 text-sm">
                {isConfirming ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : hash ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Loader2 className="h-4 w-4 text-muted-foreground" />
                )}
                Waiting for confirmations
              </li>
              <li className="flex items-center gap-2 text-sm">
                {success ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Loader2 className="h-4 w-4 text-muted-foreground" />
                )}
                Confirmed
              </li>
            </ul>
            {errorMsg && (
              <div className="text-destructive text-sm bg-destructive/10 border border-destructive/30 rounded-md p-2">
                {errorMsg}
              </div>
            )}
          </section>

          <Button
            onClick={handleSaveToBlockchain}
            disabled={(isPending || isConfirming) || (!storeAchievements && !mintNFT) || (chainId !== monadTestnet.id)}
            className="w-full"
            size="lg"
          >
            {(isPending || isConfirming) ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isPending ? "Confirm in Wallet..." : "Saving to Monad..."}
              </>
            ) : (
              "Save to Monad"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
