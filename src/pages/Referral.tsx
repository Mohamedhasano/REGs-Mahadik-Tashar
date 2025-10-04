import { useState, useEffect } from "react";
import { ArrowLeft, Gift, Users, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Referral = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  const referralCode = "REG9****4";
  const referralLink = "https://regs.global/ref/REG9****4";
  const progress = 94.87;
  const accumulatedTokens = "47.4366 REGS";
  
  const rewardTiers = [
    { icon: Gift, amount: "$20", active: true },
    { icon: Gift, amount: "$20", active: false },
    { icon: Gift, amount: "$20", active: false },
    { icon: Gift, amount: "$20", active: false },
    { icon: Gift, amount: "$20", active: false },
    { icon: Gift, amount: "$50", active: false, bonus: true },
  ];

  useEffect(() => {
    setMounted(true);
    // Animate progress on mount
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-accent rounded-lg transition-all duration-200 hover:scale-110"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">EARN TOGETHER</h1>
        <div className="w-9" />
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Time Limited Banner */}
        <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 animate-scale-in hover-scale">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Referral</span>
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                Time-Limited
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Main Title */}
        <div className="text-center space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-bold">EARN TOGETHER</h2>
          <p className="text-muted-foreground">
            Invite friends to earn trending halal tokens — REGS & INIT!
          </p>
        </div>

        {/* Reward Tiers */}
        <Card className="bg-card/50 backdrop-blur animate-fade-in hover-scale" style={{ animationDelay: '0.3s' }}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              {rewardTiers.map((tier, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center animate-scale-in hover:scale-110 transition-transform duration-200 cursor-pointer"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-2 transition-all duration-300 ${
                    tier.active
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  } ${tier.bonus ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/25' : ''}`}>
                    <tier.icon className="h-6 w-6 transition-transform duration-200" />
                  </div>
                  <span className={`text-sm font-medium ${
                    tier.active ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {tier.amount}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress Circle */}
        <div className="flex justify-center animate-scale-in" style={{ animationDelay: '0.5s' }}>
          <div className="relative w-64 h-64">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-muted/20"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${animatedProgress * 2.827} 282.7`}
                className="text-primary transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="text-4xl font-bold mb-2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                {mounted ? `${progress}%` : '0%'}
              </div>
              <div className="text-sm text-muted-foreground mb-1 animate-fade-in" style={{ animationDelay: '0.9s' }}>
                You've accumulated
              </div>
              <div className="text-lg font-semibold text-primary animate-fade-in" style={{ animationDelay: '1s' }}>
                {accumulatedTokens}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 hover-scale animate-fade-in" 
                style={{ animationDelay: '1.1s' }}
              >
                Withdraw
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="text-center space-y-2 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm text-muted-foreground">
            A total of 5 users claimed the vouchers
          </p>
          <p className="text-sm">
            <span className="font-medium">User {referralCode}</span> has received{" "}
            <span className="text-primary font-medium">50 REGS</span> in tokens
          </p>
        </div>

        {/* Countdown */}
        <Card className="hover-scale animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Current round time left:</p>
            <div className="flex justify-center gap-2 text-lg font-mono">
              <span>8 D</span>
              <span>23 H</span>
              <span>52 M</span>
            </div>
          </CardContent>
        </Card>

        {/* Referral Link */}
        <Card className="hover-scale animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Share Your Referral Link</h3>
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-muted rounded-lg text-sm font-mono break-all transition-all duration-200 hover:bg-muted/80">
                {referralLink}
              </div>
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="icon"
                className={`shrink-0 transition-all duration-200 hover:scale-110 ${
                  copied ? 'bg-primary text-primary-foreground animate-scale-in' : ''
                }`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Invite Button */}
        <Button 
          className="w-full h-12 text-lg font-semibold hover:scale-105 transition-all duration-200 animate-fade-in shadow-lg hover:shadow-xl" 
          size="lg"
          style={{ animationDelay: '0.9s' }}
        >
          Invite Now
        </Button>
      </div>
    </div>
  );
};

export default Referral;