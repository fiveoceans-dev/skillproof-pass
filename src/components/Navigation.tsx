import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold glow-text">monad.passport</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#discover" className="text-muted-foreground hover:text-foreground transition-colors">
            Discover
          </a>
          <a href="#badges" className="text-muted-foreground hover:text-foreground transition-colors">
            Badges
          </a>
          <a href="#legal" className="text-muted-foreground hover:text-foreground transition-colors">
            Legal
          </a>
        </div>

        <Button onClick={() => navigate("/auth")}>
          Get Started
        </Button>
      </div>
    </nav>
  );
};
