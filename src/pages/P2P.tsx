import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useBinanceTicker } from "@/hooks/useBinanceTicker";

interface Offer {
  id: string;
  side: "buy" | "sell";
  token: string; // e.g. USDT, REGS
  fiat: string; // e.g. PKR, INR
  price: number; // fiat per token
  min: number;
  max: number;
  methods: string[];
  trader: string;
  rating: number; // 0..5
  available: number; // token amount available
}

const LS_KEY = "p2p_offers";

function loadOffers(): Offer[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Seed with a richer set of demo offers on first load
  const seed = generateOffers(30);
  try { localStorage.setItem(LS_KEY, JSON.stringify(seed)); } catch {}
  return seed;
}

function saveOffers(o: Offer[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(o)); } catch {}
}

// Demo offer generator for showcasing more buyers and sellers
const traderNames = ["AlphaTrades","RegsPro","PKBuyer","SwiftEx","CoinHub","DeltaDesk","QuickSwap","MarketFox","ZetaTrade","NovaOTC","TrustX","ZenEx"];
const paymentPresets = [["Bank"],["Bank","JazzCash"],["Bank","Easypaisa"]];
function basePrice(token: string, fiat: string) {
  if (token === "USDT") return fiat === "PKR" ? 85 : 83;
  return fiat === "PKR" ? 2200 : 2000; // REGS baseline
}
function generateOffers(count = 20): Offer[] {
  const tokens: Array<Offer["token"]> = ["USDT","REGS"];
  const fiats: Array<Offer["fiat"]> = ["PKR"];
  const sides: Array<Offer["side"]> = ["buy","sell"];
  const out: Offer[] = [];
  for (let i = 0; i < count; i++) {
    const token = tokens[Math.floor(Math.random()*tokens.length)];
    const fiat = fiats[Math.floor(Math.random()*fiats.length)];
    const side = sides[Math.floor(Math.random()*sides.length)];
    const base = basePrice(token, fiat);
    const price = Number((base * (0.96 + Math.random()*0.08)).toFixed(2));
    const available = token === "USDT" ? Math.floor(200 + Math.random()*5000) : Math.floor(20 + Math.random()*1000);
    const min = Math.floor(100 + Math.random()*4900); // fiat
    const max = min + Math.floor(500 + Math.random()*10000); // fiat
    const trader = traderNames[Math.floor(Math.random()*traderNames.length)] + (Math.random()<0.2? ("-" + Math.floor(Math.random()*99)) : "");
    const methods = paymentPresets[Math.floor(Math.random()*paymentPresets.length)];
    const rating = Number((4.5 + Math.random()*0.5).toFixed(1));
    out.push({ id: crypto.randomUUID(), side, token, fiat, price, min, max, methods, trader, rating, available });
  }
  return out;
}

export default function P2P() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>(loadOffers());
  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [token, setToken] = useState("USDT");
  const [fiat, setFiat] = useState("PKR");
  const [amount, setAmount] = useState(100);

  const { lastPrice: btc } = useBinanceTicker("BTC");
  const { lastPrice: eth } = useBinanceTicker("ETH");
  const { lastPrice: sol } = useBinanceTicker("SOL");
  const fmt = (n?: number) => (n || n === 0) ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—";

  // Post Offer dialog
  const [postOpen, setPostOpen] = useState(false);
  const [form, setForm] = useState<Offer>({ id: "", side: "sell", token: "USDT", fiat: "PKR", price: 85, min: 50, max: 2000, methods: ["Bank"], trader: "Me", rating: 5, available: 1000 });

  // Place Order dialog
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  useEffect(() => {
    document.title = "Halal P2P Trading — REGS Global";
    const desc = "Buy and sell Sharia-compliant digital assets (USDT, REGS) with local payments on REGS Global P2P platform - Islamic finance principles.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.setAttribute("name", "description"); document.head.appendChild(meta); }
    meta.setAttribute("content", desc);

    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.setAttribute("rel", "canonical"); document.head.appendChild(link); }
    link.setAttribute("href", window.location.origin + "/p2p");

    const existing = document.getElementById("ld-p2p");
    if (existing) existing.remove();
    const ld = document.createElement("script");
    ld.type = "application/ld+json";
    ld.id = "ld-p2p";
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "P2P Offers",
      itemListElement: offers.slice(0, 10).map((o, i) => ({ "@type": "Offer", position: i + 1, price: o.price, priceCurrency: o.fiat, itemOffered: { "@type": "CryptoCurrency", name: o.token } }))
    });
    document.head.appendChild(ld);
  }, [offers]);

  const filtered = useMemo(() => offers.filter(o => o.side === (tab === "buy" ? "sell" : "buy") && o.token === token && o.fiat === fiat).sort((a,b)=> a.price - b.price), [offers, tab, token, fiat]);

  const best = filtered[0];
  const estCost = best ? (tab === "buy" ? amount * best.price : amount * best.price) : 0;

  const placeOrder = (o: Offer) => { setSelectedOffer(o); setOrderOpen(true); };

  const confirmOrder = () => {
    if (!selectedOffer) return;
    toast({ title: `${tab === "buy" ? "Buy" : "Sell"} order placed`, description: `${amount} ${selectedOffer.token} @ ${selectedOffer.price} ${selectedOffer.fiat}` });
    setOrderOpen(false);
  };

const submitPost = () => {
  const newOffer = { ...form, id: crypto.randomUUID() };
  const next = [newOffer, ...offers];
  setOffers(next);
  saveOffers(next);
  setPostOpen(false);
  toast({ title: "Offer posted", description: `${newOffer.side.toUpperCase()} ${newOffer.token} @ ${newOffer.price} ${newOffer.fiat}` });
};

const addMoreOffers = (count = 20) => {
  const more = generateOffers(count);
  const next = [...more, ...offers];
  setOffers(next);
  saveOffers(next);
  toast({ title: "More offers added", description: `${more.length} sample offers loaded` });
};

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Back" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base font-medium">P2P Trading</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => addMoreOffers(20)}>More offers</Button>
            <Button variant="default" onClick={() => setPostOpen(true)}>Post new offer</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 space-y-6">
        <section>
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-28">
              <Label className="text-xs">Token</Label>
              <Select value={token} onValueChange={setToken}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Token" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="REGS">REGS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-28">
              <Label className="text-xs">Fiat</Label>
              <Select value={fiat} onValueChange={setFiat}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Fiat" /></SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="PKR">PKR</SelectItem>
                  <SelectItem value="USDT">USDT — 1.00</SelectItem>
                  <SelectItem value="BTC">BTC — {fmt(btc)} USDT</SelectItem>
                  <SelectItem value="ETH">ETH — {fmt(eth)} USDT</SelectItem>
                  <SelectItem value="SOL">SOL — {fmt(sol)} USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label className="text-xs">Amount ({token})</Label>
              <Input type="number" value={amount} min={0} onChange={(e)=> setAmount(Number(e.target.value) || 0)} />
            </div>
            <div>
              <Label className="text-xs">Est. {fiat}</Label>
              <div className="h-9 flex items-center font-medium">{best ? estCost.toFixed(2) : "—"}</div>
            </div>
          </div>
        </section>

        <section>
          <Tabs value={tab} onValueChange={(v)=> setTab(v as any)}>
            <TabsList className="rounded-full bg-muted p-1">
              <TabsTrigger value="buy" className="rounded-full">Buy {token}</TabsTrigger>
              <TabsTrigger value="sell" className="rounded-full">Sell {token}</TabsTrigger>
            </TabsList>
            <TabsContent value="buy" className="mt-4">
              <OfferTable offers={filtered} actionLabel="Buy" onAction={placeOrder} />
            </TabsContent>
            <TabsContent value="sell" className="mt-4">
              <OfferTable offers={filtered} actionLabel="Sell" onAction={placeOrder} />
            </TabsContent>
          </Tabs>
        </section>

        <Card className="card-elevated">
          <CardContent className="p-4 text-xs text-muted-foreground">
            Always trade with verified merchants. Check limits and payment methods before placing orders.
          </CardContent>
        </Card>
      </main>

      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tab === "buy" ? "Buy" : "Sell"} {selectedOffer?.token}</DialogTitle>
          </DialogHeader>
          {selectedOffer && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between"><span>Price</span><span className="font-medium">{selectedOffer.price} {selectedOffer.fiat}</span></div>
              <div className="flex items-center justify-between"><span>Amount</span><span className="font-medium">{amount} {selectedOffer.token}</span></div>
              <div className="flex items-center justify-between"><span>Total</span><span className="font-medium">{(amount * selectedOffer.price).toFixed(2)} {selectedOffer.fiat}</span></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={()=> setOrderOpen(false)}>Cancel</Button>
            <Button onClick={confirmOrder}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={postOpen} onOpenChange={setPostOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Post new offer</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs">Side</Label>
              <Select value={form.side} onValueChange={(v)=> setForm({ ...form, side: v as any })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Token</Label>
              <Select value={form.token} onValueChange={(v)=> setForm({ ...form, token: v })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="REGS">REGS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Fiat</Label>
              <Select value={form.fiat} onValueChange={(v)=> setForm({ ...form, fiat: v })}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent className="z-50 bg-popover">
                  <SelectItem value="PKR">PKR</SelectItem>
                  <SelectItem value="USDT">USDT — 1.00</SelectItem>
                  <SelectItem value="BTC">BTC — {fmt(btc)} USDT</SelectItem>
                  <SelectItem value="ETH">ETH — {fmt(eth)} USDT</SelectItem>
                  <SelectItem value="SOL">SOL — {fmt(sol)} USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Price ({form.fiat} per {form.token})</Label>
              <Input type="number" value={form.price} onChange={(e)=> setForm({ ...form, price: Number(e.target.value) || 0 })} />
            </div>
            <div>
              <Label className="text-xs">Available ({form.token})</Label>
              <Input type="number" value={form.available} onChange={(e)=> setForm({ ...form, available: Number(e.target.value) || 0 })} />
            </div>
            <div>
              <Label className="text-xs">Min</Label>
              <Input type="number" value={form.min} onChange={(e)=> setForm({ ...form, min: Number(e.target.value) || 0 })} />
            </div>
            <div>
              <Label className="text-xs">Max</Label>
              <Input type="number" value={form.max} onChange={(e)=> setForm({ ...form, max: Number(e.target.value) || 0 })} />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Payment Methods (comma separated)</Label>
              <Input value={form.methods.join(", ")} onChange={(e)=> setForm({ ...form, methods: e.target.value.split(",").map(s=>s.trim()).filter(Boolean) })} />
            </div>
            <div>
              <Label className="text-xs">Trader name</Label>
              <Input value={form.trader} onChange={(e)=> setForm({ ...form, trader: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={()=> setPostOpen(false)}>Cancel</Button>
            <Button onClick={submitPost}>Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">P2P Trading</h1>
    </div>
  );
}

function OfferTable({ offers, actionLabel, onAction }: { offers: Offer[]; actionLabel: string; onAction: (o: Offer) => void }) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Trader</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Limits</TableHead>
            <TableHead>Methods</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((o) => (
            <TableRow key={o.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{o.trader}</span>
                  <Badge variant="secondary" className="gap-1"><ShieldCheck className="h-3.5 w-3.5" /> {o.rating.toFixed(1)}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">Avail: {o.available} {o.token}</div>
              </TableCell>
              <TableCell className="font-medium">{o.price} {o.fiat}</TableCell>
              <TableCell className="text-sm">{o.min} - {o.max} {o.fiat}</TableCell>
              <TableCell className="text-sm">{o.methods.join(", ")}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" onClick={() => onAction(o)}>{actionLabel}</Button>
              </TableCell>
            </TableRow>
          ))}
          {offers.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">No offers found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
