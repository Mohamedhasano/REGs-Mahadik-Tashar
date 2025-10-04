import { useEffect, useMemo, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatbotProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  content: string;
}

const quickSuggestions = [
  { label: "How to add funds?", value: "How do I deposit / add funds?" },
  { label: "P2P USDT/PKR rate", value: "What is the current P2P USDT/PKR rate?" },
  { label: "Place a trade", value: "How do I place a spot trade?" },
  { label: "Contact support", value: "support" },
];

function getBotReply(text: string): string {
  const t = text.toLowerCase();

  if (t.includes("deposit") || t.includes("add funds") || t.includes("top up")) {
    return (
      "To add funds: Home > Add Funds. For bank/P2P options, check the P2P card (USDT/PKR). Fees vary by method."
    );
  }

  if (t.includes("p2p") || (t.includes("usdt") && t.includes("pkr")) || t.includes("rate")) {
    return (
      "P2P lets you buy/sell USDT with PKR. On Home, open the P2P card (USDT/PKR). Always verify the quoted rate and trader reputation."
    );
  }

  if (t.includes("trade") || t.includes("spot")) {
    return (
      "To place a trade: Markets > pick a pair > Trade. Set price/amount and submit your order."
    );
  }

  if (t.includes("withdraw")) {
    return (
      "Withdraw: go to Wallet > Withdraw. Choose the asset/network, enter address and amount, then confirm."
    );
  }

  if (t.includes("kyc") || t.includes("verify") || t.includes("verification")) {
    return (
      "KYC: open Profile > Verification. Upload required documents and follow on-screen steps."
    );
  }

  if (t.includes("support") || t.includes("help") || t.includes("contact")) {
    return (
      "You can reach support from the header headset icon. Describe your issue and we’ll get back ASAP."
    );
  }

  return (
    "I can help with deposits, P2P USDT/PKR, trading, withdrawals, and KYC. Ask a question or use a quick suggestion below."
  );
}

export default function Chatbot({ open, onOpenChange }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const listEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Seed welcome message when opened first time
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: crypto.randomUUID(),
          role: "bot",
          content:
            "Hi! I’m the REGS Assistant. Ask me about adding funds, P2P USDT/PKR, trading, or account help.",
        },
      ]);
    }
  }, [open]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate bot thinking
    const reply = getBotReply(trimmed);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "bot", content: reply },
      ]);
    }, 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle>REGS Assistant</SheetTitle>
          <SheetDescription>Ask product or account questions. I’ll guide you.</SheetDescription>
        </SheetHeader>

        <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2 border-b bg-muted/50">
          {quickSuggestions.map((s) => (
            <Button key={s.label} size="sm" variant="secondary" onClick={() => handleSend(s.value)}>
              {s.label}
            </Button>
          ))}
        </div>

        <ScrollArea className="flex-1 px-4 py-3">
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex items-start gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "bot" && (
                  <div className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-lg border px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground border-transparent"
                      : "bg-background"
                  }`}
                >
                  {m.content}
                </div>

                {m.role === "user" && (
                  <div className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            <div ref={listEndRef} />
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="border-t p-3 flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            aria-label="Chat message"
          />
          <Button type="submit" aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
