import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Loader2 } from "lucide-react";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verificationCode: string;
  onVerify: () => void;
  isVerifying: boolean;
}

export function VerificationModal({
  isOpen,
  onClose,
  verificationCode,
  onVerify,
  isVerifying,
}: VerificationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Account Ownership</DialogTitle>
          <DialogDescription>
            Follow these steps to prove you own this account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="bg-primary/10 border-primary/30">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription>
              <div className="space-y-3">
                <p className="font-semibold text-foreground">Change your profile icon to:</p>
                <div className="flex items-center gap-4 p-4 bg-background rounded-lg border border-primary/20">
                  <img
                    src={`http://ddragon.leagueoflegends.com/cdn/13.23.1/img/profileicon/${verificationCode}.png`}
                    alt={`Profile icon ${verificationCode}`}
                    className="w-20 h-20 rounded-lg border-2 border-primary shadow-lg"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">Icon Number:</p>
                    <p className="text-3xl font-bold text-primary">#{verificationCode}</p>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-3 text-sm">
            <p className="font-semibold">Steps to verify:</p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Open your League of Legends client</li>
              <li>Go to your profile settings</li>
              <li>Change your profile icon to the one shown above</li>
              <li>Click "Verify Ownership" below</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isVerifying}>
              Cancel
            </Button>
            <Button onClick={onVerify} className="flex-1" disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Ownership"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
