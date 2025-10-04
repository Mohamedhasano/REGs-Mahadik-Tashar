import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, TrendingUp, Shield, Clock, Star, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface P2PTradingSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function P2PTradingSheet({ open, onOpenChange }: P2PTradingSheetProps) {
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [selectedCrypto, setSelectedCrypto] = useState("USDT");
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const cryptos = [
    { symbol: "USDT", name: "Tether" },
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "REGS", name: "REGS Token" },
  ];

  // Mock P2P offers
  const p2pOffers = [
    {
      id: "1",
      trader: "CryptoPro_PK",
      rating: 4.8,
      trades: 1205,
      price: 278.50,
      min: 5000,
      max: 500000,
      payment: ["EasyPaisa", "JazzCash"],
      completion: "15 mins"
    },
    {
      id: "2", 
      trader: "BitMaster007",
      rating: 4.9,
      trades: 892,
      price: 278.75,
      min: 10000,
      max: 1000000,
      payment: ["Bank Transfer", "EasyPaisa"],
      completion: "20 mins"
    },
    {
      id: "3",
      trader: "PKTrader_24",
      rating: 4.7,
      trades: 567,
      price: 279.00,
      min: 2000,
      max: 200000,
      payment: ["JazzCash", "HBL", "UBL"],
      completion: "10 mins"
    }
  ];

  const handleTradeRequest = (offer: typeof p2pOffers[0]) => {
    if (!amount) {
      toast({
        title: "Enter Amount",
        description: "Please enter the amount you want to trade",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Trade Request Sent",
      description: `Your ${side} request for ${amount} ${selectedCrypto} has been sent to ${offer.trader}`,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-4 pb-6 max-h-[90vh]">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            P2P Trading
          </SheetTitle>
          <SheetDescription>
            Trade directly with verified users using local payment methods
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          {/* Trading Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>I want to</Label>
              <Tabs value={side} onValueChange={(v) => setSide(v as "buy" | "sell")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="buy" className="text-green-600 data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                    Buy
                  </TabsTrigger>
                  <TabsTrigger value="sell" className="text-red-600 data-[state=active]:bg-red-100 data-[state=active]:text-red-800">
                    Sell
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label>Cryptocurrency</Label>
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cryptos.map((crypto) => (
                    <SelectItem key={crypto.symbol} value={crypto.symbol}>
                      {crypto.name} ({crypto.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="p2p-amount">Amount (PKR)</Label>
            <Input
              id="p2p-amount"
              type="number"
              placeholder="Enter amount in PKR"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Available Offers */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Available {side === "buy" ? "Sellers" : "Buyers"}</span>
                <Badge variant="secondary">{p2pOffers.length} offers</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-3 px-4 pb-4">
                {p2pOffers.map((offer) => (
                  <Card key={offer.id} className="border-l-4 border-l-primary/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{offer.trader}</div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{offer.rating}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {offer.trades} trades
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">PKR {offer.price}</div>
                          <div className="text-xs text-muted-foreground">per {selectedCrypto}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Limits:</span>
                          <div className="font-medium">
                            PKR {offer.min.toLocaleString()} - {offer.max.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Completion:</span>
                          <div className="font-medium flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {offer.completion}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {offer.payment.map((method) => (
                            <Badge key={method} variant="secondary" className="text-xs">
                              {method}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleTradeRequest(offer)}
                          className="h-7"
                        >
                          {side === "buy" ? "Buy" : "Sell"} {selectedCrypto}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* P2P Features */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <Shield className="h-5 w-5 mx-auto text-green-500" />
                  <div className="text-xs font-medium">Escrow</div>
                  <div className="text-xs text-muted-foreground">Protected</div>
                </div>
                <div className="space-y-1">
                  <MessageCircle className="h-5 w-5 mx-auto text-blue-500" />
                  <div className="text-xs font-medium">Chat</div>
                  <div className="text-xs text-muted-foreground">Built-in</div>
                </div>
                <div className="space-y-1">
                  <TrendingUp className="h-5 w-5 mx-auto text-primary" />
                  <div className="text-xs font-medium">Best Rates</div>
                  <div className="text-xs text-muted-foreground">Market Price</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => {
              toast({
                title: "Create Ad",
                description: "P2P ad creation feature coming soon",
              });
            }}>
              Create Ad
            </Button>
          </div>

          {/* Safety Notice */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-3">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Safety First:</strong> All trades are protected by escrow. Only release crypto after confirming payment receipt. Report suspicious activity immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}