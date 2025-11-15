import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import badgeIcon from "@/assets/badge-icon.png";

export const BadgeShowcase = () => {
  const badges = [
    {
      name: "Diamond Ascent",
      rarity: "Epic",
      description: "Achieved Diamond rank",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Season Victor",
      rarity: "Legendary",
      description: "100+ ranked wins in season",
      color: "from-amber-500 to-orange-500",
    },
    {
      name: "Pentakill Master",
      rarity: "Rare",
      description: "Earned 5 pentakills",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Consistent Climber",
      rarity: "Common",
      description: "10 game win streak",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section id="badges" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Achievement Badge NFTs</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Earn verifiable on-chain badges for your League of Legends accomplishments. 
            Each badge is a unique NFT that proves your skill and dedication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {badges.map((badge, index) => (
            <Card 
              key={index} 
              className="glass-card border-primary/20 hover:border-primary/50 transition-all hover:scale-105 overflow-hidden group"
            >
              <CardContent className="p-6 space-y-4">
                <div className={`relative w-full aspect-square rounded-xl bg-gradient-to-br ${badge.color} p-1`}>
                  <div className="w-full h-full bg-card rounded-lg flex items-center justify-center">
                    <img 
                      src={badgeIcon} 
                      alt={badge.name}
                      className="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">{badge.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {badge.rarity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                  <span>Mintable</span>
                  <span className="text-primary font-semibold">0.001 ETH</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
