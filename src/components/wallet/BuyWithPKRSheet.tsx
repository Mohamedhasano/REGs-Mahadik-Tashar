import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Building, Smartphone, CheckCircle2, Clock, Shield } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface BuyWithPKRSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BuyWithPKRSheet({ open, onOpenChange }: BuyWithPKRSheetProps) {
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const cryptos = [
    { symbol: "BTC", name: "Bitcoin", price: 4950000 },
    { symbol: "ETH", name: "Ethereum", price: 320000 },
    { symbol: "USDT", name: "Tether", price: 278 },
    { symbol: "REGS", name: "REGS Token", price: 278 },
  ];

  const paymentMethods = [
    { id: "bank", name: "Bank Transfer", icon: Building, desc: "EasyPaisa, JazzCash, Bank Account" },
    { id: "card", name: "Debit/Credit Card", icon: CreditCard, desc: "Visa, Mastercard" },
    { id: "mobile", name: "Mobile Wallet", icon: Smartphone, desc: "EasyPaisa, JazzCash" },
  ];

  const selectedCryptoData = cryptos.find(c => c.symbol === selectedCrypto);
  const pkrAmount = amount ? (parseFloat(amount) * (selectedCryptoData?.price || 0)).toLocaleString() : "0";

  const handlePurchase = () => {
    if (!amount || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please enter amount and select payment method",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      toast({
        title: "Purchase Initiated",
        description: `Purchase order for ${amount} ${selectedCrypto} has been submitted for review`,
      });
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-4 pb-6 max-h-[90vh]">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Buy Crypto with PKR
          </SheetTitle>
          <SheetDescription>
            Purchase cryptocurrency using Pakistani Rupees via bank transfer, cards, or mobile wallets
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          {/* Crypto Selection */}
          <div className="space-y-2">
            <Label>Select Cryptocurrency</Label>
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cryptos.map((crypto) => (
                  <SelectItem key={crypto.symbol} value={crypto.symbol}>
                    <div className="flex items-center justify-between w-full">
                      <span>{crypto.name} ({crypto.symbol})</span>
                      <Badge variant="outline" className="ml-2">
                        PKR {crypto.price.toLocaleString()}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount to Buy</Label>
            <Input
              id="amount"
              type="number"
              placeholder={`Enter ${selectedCrypto} amount`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.000001"
            />
            {amount && (
              <p className="text-sm text-muted-foreground">
                ≈ PKR {pkrAmount}
              </p>
            )}
          </div>

          {/* Payment Methods */}
          <div className="space-y-2">
            <Label>Payment Method</Label>
            <div className="grid gap-2">
              {paymentMethods.map((method) => (
                <Button
                  key={method.id}
                  variant={paymentMethod === method.id ? "default" : "outline"}
                  className="justify-start h-auto p-3"
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <div className="flex items-center gap-3">
                    <method.icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-xs text-muted-foreground">{method.desc}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          {amount && paymentMethod && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Amount:</span>
                  <span className="font-medium">{amount} {selectedCrypto}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Price:</span>
                  <span>PKR {selectedCryptoData?.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Payment Fee:</span>
                  <span>PKR 50</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>PKR {(parseFloat(pkrAmount.replace(/,/g, '')) + 50).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Features */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <Shield className="h-5 w-5 mx-auto text-green-500" />
                  <div className="text-xs font-medium">Secure</div>
                  <div className="text-xs text-muted-foreground">Bank Grade</div>
                </div>
                <div className="space-y-1">
                  <Clock className="h-5 w-5 mx-auto text-blue-500" />
                  <div className="text-xs font-medium">Fast</div>
                  <div className="text-xs text-muted-foreground">15-30 mins</div>
                </div>
                <div className="space-y-1">
                  <CheckCircle2 className="h-5 w-5 mx-auto text-primary" />
                  <div className="text-xs font-medium">Verified</div>
                  <div className="text-xs text-muted-foreground">KYC Required</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
              Cancel
            </Button>
            <Button onClick={handlePurchase} disabled={!amount || !paymentMethod || processing}>
              {processing ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                "Buy Now"
              )}
            </Button>
          </div>

          {/* Disclaimer */}
          <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-3">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> All fiat purchases require KYC verification. Processing time may vary based on payment method and bank processing times.
              </p>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}