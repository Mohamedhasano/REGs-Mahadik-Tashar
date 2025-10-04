import { useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TraderCard, { TraderCardProps } from "@/components/smart/TraderCard";
import { Card } from "@/components/ui/card";

function genSeries(n = 24) {
  let v = 100;
  return Array.from({ length: n }, () => {
    v += (Math.random() - 0.45) * 8;
    return Math.max(10, v);
  });
}

export default function Smart() {
  const [tab, setTab] = useState<"subscriptions" | "top">("top");
  const [range, setRange] = useState("30D");
  const [metric, setMetric] = useState("Total PnL");

  useEffect(() => {
    document.title = "Smart Money — REGs Global";
    const desc = "Discover top traders with 30D PnL, ROI, and assets. Mock UI for live-feel copy-trading.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.setAttribute("name", "description"); document.head.appendChild(meta); }
    meta.setAttribute("content", desc);
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.setAttribute("rel", "canonical"); document.head.appendChild(link); }
    link.setAttribute("href", window.location.origin + "/smart");
  }, []);

  const traders: TraderCardProps[] = useMemo(() => [
    { name: "Big_Candle_Capital_Jimmy", tag: "BCC_Jimmy", subscribers: 56405, pnl30d: 54910267.71, roi30d: 17.45, assets: 6131403.87, series: genSeries() },
    { name: "User-05bf5", tag: "KR-Pro", subscribers: 28396, pnl30d: 4047275.78, roi30d: 37.78, assets: 486476.6, series: genSeries() },
    { name: "Ohtanishohei", tag: "Blacksang", subscribers: 35623, pnl30d: 3074167.76, roi30d: 22.19, assets: 12071201.57, series: genSeries() },
    { name: "Libertarian_Ricky", tag: "Main", subscribers: 27643, pnl30d: 2193707.29, roi30d: 55.63, assets: 5195961.33, series: genSeries() },
  ], []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="/futures" className="hover:text-foreground">USDⓢ-M</a>
            <a href="/coin-m" className="hover:text-foreground">COIN-M</a>
            <a href="/options" className="hover:text-foreground">Options</a>
            <a href="/smart" className="font-medium text-foreground">Smart Money</a>
          </nav>
          <h1 className="text-2xl md:text-3xl font-semibold gradient-text mt-2">Smart Money</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-4">
        <section className="flex items-center gap-4 text-sm">
          <button
            onClick={() => setTab("subscriptions")}
            className={["pb-1", tab === "subscriptions" ? "text-foreground border-b-2 border-[hsl(var(--primary))]" : "text-muted-foreground"].join(" ")}
          >
            My Subscriptions
          </button>
          <button
            onClick={() => setTab("top")}
            className={["pb-1", tab === "top" ? "text-foreground border-b-2 border-[hsl(var(--primary))]" : "text-muted-foreground"].join(" ")}
          >
            Top Traders
          </button>

          <div className="ml-auto flex items-center gap-2">
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["7D", "30D", "90D"] as const).map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {(["Total PnL", "ROI", "Assets"] as const).map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        {tab === "subscriptions" ? (
          <Card className="p-6 text-center text-muted-foreground">You have no subscriptions yet.</Card>
        ) : (
          <section className="space-y-3">
            {traders.map((t) => (
              <TraderCard key={t.name} {...t} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
