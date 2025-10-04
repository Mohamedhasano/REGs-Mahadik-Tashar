import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Send, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { useAssetBalances, subtractFromBalance } from "@/hooks/useAssetBalances";
import { addAssetTransaction } from "@/hooks/useAssetHistory";

export default function Transfer() {
  const navigate = useNavigate();
  const { balances } = useAssetBalances();
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [memo, setMemo] = useState<string>("");

  const availableAssets = balances.filter(balance => balance.amount > 0);
  const selectedAssetData = availableAssets.find(asset => asset.symbol === selectedAsset);

  const handleSend = () => {
    if (!selectedAsset || !amount || !recipient) {
      toast.error("Please fill in all required fields");
      return;
    }

    const sendAmount = parseFloat(amount);
    if (isNaN(sendAmount) || sendAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (selectedAssetData && sendAmount > selectedAssetData.amount) {
      toast.error("Insufficient balance");
      return;
    }

    // Calculate fees
    const networkFee = 0.0001;
    const platformFee = sendAmount * 0.001; // 0.1% platform fee
    const totalDeduction = sendAmount + networkFee + platformFee;
    
    // Check if balance is sufficient including fees
    if (selectedAssetData && totalDeduction > selectedAssetData.amount) {
      toast.error("Insufficient balance (including fees)");
      return;
    }
    
    // Subtract from balance
    const success = subtractFromBalance(selectedAsset, totalDeduction);
    if (!success) {
      toast.error("Failed to process transaction");
      return;
    }
    
    // Record transaction
    addAssetTransaction({
      type: "send",
      asset: selectedAsset,
      amount: sendAmount,
      recipient,
      networkFee,
      platformFee,
      memo,
    });
    
    toast.success(`Successfully sent ${amount} ${selectedAsset} to ${recipient.slice(0, 8)}...`);
    
    // Reset form
    setSelectedAsset("");
    setAmount("");
    setRecipient("");
    setMemo("");
  };

  const handleMaxAmount = () => {
    if (selectedAssetData) {
      setAmount(selectedAssetData.amount.toString());
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/assets")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold">Transfer Assets</h1>
          </div>
        </div>

        {/* Transfer Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Assets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Asset Selection */}
            <div className="space-y-2">
              <Label htmlFor="asset">Select Asset</Label>
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger id="asset">
                  <SelectValue placeholder="Choose an asset" />
                </SelectTrigger>
                <SelectContent>
                  {availableAssets.map((asset) => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      <div className="flex items-center justify-between w-full">
                        <span>{asset.symbol}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          Balance: {asset.amount}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="any"
                />
                {selectedAssetData && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 text-xs"
                    onClick={handleMaxAmount}
                  >
                    MAX
                  </Button>
                )}
              </div>
              {selectedAssetData && (
                <p className="text-xs text-muted-foreground">
                  Available: {selectedAssetData.amount} {selectedAsset}
                </p>
              )}
            </div>

            {/* Recipient Address */}
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="Enter wallet address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            {/* Memo (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="memo">Memo (Optional)</Label>
              <Input
                id="memo"
                placeholder="Transaction note"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>

            {/* Transaction Summary */}
            {selectedAsset && amount && recipient && (
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Transaction Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Asset:</span>
                      <span>{selectedAsset}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span>{amount} {selectedAsset}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">To:</span>
                      <span className="font-mono text-xs">
                        {recipient.slice(0, 8)}...{recipient.slice(-8)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network Fee:</span>
                      <span>0.0001 {selectedAsset}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fee (0.1%):</span>
                      <span>{(parseFloat(amount || "0") * 0.001).toFixed(6)} {selectedAsset}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>{(parseFloat(amount || "0") + 0.0001 + (parseFloat(amount || "0") * 0.001)).toFixed(6)} {selectedAsset}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate("/assets")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleSend} className="flex-1">
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}