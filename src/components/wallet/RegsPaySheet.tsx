import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, QrCode, Share2, CheckCircle2, Wallet } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode.react";

interface RegsPaySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RegsPaySheet({ open, onOpenChange }: RegsPaySheetProps) {
  const [selectedAsset, setSelectedAsset] = useState("REGS");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const assets = [
    { symbol: "REGS", name: "REGS Token", balance: 1250.50 },
    { symbol: "BTC", name: "Bitcoin", balance: 0.0123 },
    { symbol: "ETH", name: "Ethereum", balance: 0.45 },
    { symbol: "USDT", name: "Tether", balance: 250.32 },
  ];

  // Generate a mock Regs Pay ID
  const regsPayId = `regs.pay/${selectedAsset.toLowerCase()}/${Math.random().toString(36).substr(2, 8)}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(regsPayId);
    toast({
      title: "Copied to clipboard",
      description: "Regs Pay ID copied successfully",
    });
  };

  const handleShare = () => {
    const shareText = `Send me ${amount} ${selectedAsset} via Regs Pay: ${regsPayId}${message ? `\nMessage: ${message}` : ''}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Regs Pay Request",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Request copied",
        description: "Payment request copied to clipboard",
      });
    }
  };

  const generateQRData = () => {
    return JSON.stringify({
      type: "regs_pay",
      asset: selectedAsset,
      amount: amount || "0",
      recipient: regsPayId,
      message: message
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl p-4 pb-6 max-h-[90vh]">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Receive via Regs Pay
          </SheetTitle>
          <SheetDescription>
            Create a payment request to receive crypto instantly from other Regs users
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          {/* Asset Selection */}
          <div className="space-y-2">
            <Label htmlFor="asset">Select Asset</Label>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger>
                <SelectValue placeholder="Choose asset to receive" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.symbol} value={asset.symbol}>
                    <div className="flex items-center justify-between w-full">
                      <span>{asset.name} ({asset.symbol})</span>
                      <Badge variant="outline" className="ml-2">
                        {asset.balance.toLocaleString()}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Optional)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.000001"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Input
              id="message"
              placeholder="Add a note for the sender"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Regs Pay ID Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Your Regs Pay ID</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <code className="text-sm font-mono text-primary">{regsPayId}</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyId}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              {/* QR Code */}
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <QRCode 
                  value={generateQRData()} 
                  size={120}
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Instant & secure transfer</span>
              </div>
            </CardContent>
          </Card>

          {/* Request Summary */}
          {(amount || message) && (
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Payment Request</h4>
                <div className="space-y-1 text-sm">
                  {amount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">{amount} {selectedAsset}</span>
                    </div>
                  )}
                  {message && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Message:</span>
                      <span className="font-medium">"{message}"</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share Request
            </Button>
          </div>

          {/* Instructions */}
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2 text-sm">How it works:</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Share your Regs Pay ID or QR code with the sender</li>
                <li>• They can send crypto instantly using the Regs app</li>
                <li>• Funds arrive immediately in your Regs wallet</li>
                <li>• No network fees for Regs-to-Regs transfers</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}