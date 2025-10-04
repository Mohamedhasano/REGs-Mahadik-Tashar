import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useBinanceTicker } from "@/hooks/useBinanceTicker";
import { useCommodityPrice } from "@/hooks/useCommodityPrice";
import { HalalComplianceIndicator } from "@/components/trade/HalalComplianceIndicator";
import { Search as SearchIcon, Star } from "lucide-react";

// Types
interface Row {
  symbol: string; // e.g., BTC
  display?: string; // Pretty name (optional)
  quote: "USDT" | "FDUSD" | "BNB" | "BTC" | "ALTS" | "FIAT";
  vol: number; // in coins or USD equivalent
  mockPrice: number; // fallback price when no live feed
  change: number; // 24h % change
  live?: boolean; // whether to use live price hook
  commodity?: boolean; // whether this is a commodity
}

const ALL_MARKETS: Row[] = [
  { symbol: "USDC", quote: "USDT", vol: 1.92e9, mockPrice: 1, change: 0.03 },
  { symbol: "SOL", quote: "USDT", vol: 6.87e8, mockPrice: 184.96, change: 2.41, live: true },
  { symbol: "BNB", quote: "USDT", vol: 8.23e8, mockPrice: 580.12, change: 1.25, live: true },
  { symbol: "XRP", quote: "USDT", vol: 5.45e8, mockPrice: 0.55, change: -0.85, live: true },
  
  // Commodities (Sharia compliant)
  { symbol: "GOLD", display: "Gold Spot", quote: "USDT", vol: 1.25e8, mockPrice: 2030.50, change: 1.25, commodity: true },
  { symbol: "COFFEE", display: "Arabica Coffee", quote: "USDT", vol: 8.5e7, mockPrice: 1.65, change: 3.20, commodity: true },
  { symbol: "REAL_ESTATE", display: "Real Estate Index", quote: "USDT", vol: 2.8e8, mockPrice: 145.75, change: 0.85, commodity: true },
  { symbol: "SILVER", display: "Silver Spot", quote: "USDT", vol: 4.5e7, mockPrice: 24.85, change: -0.45, commodity: true },
  { symbol: "OIL", display: "Crude Oil WTI", quote: "USDT", vol: 8.5e8, mockPrice: 78.30, change: 2.15, commodity: true },
  { symbol: "WHEAT", display: "Wheat", quote: "USDT", vol: 1.25e8, mockPrice: 685.25, change: 0.85, commodity: true },
  { symbol: "COPPER", display: "Copper", quote: "USDT", vol: 3.2e8, mockPrice: 8.45, change: -1.20, commodity: true },
  // Halal tokens
  { symbol: "REGS", quote: "USDT", vol: 1.08e8, mockPrice: 3.18, change: 7.5 },
  { symbol: "AIRLAND", display: "Airland", quote: "USDT", vol: 7.2e7, mockPrice: 0.84, change: -1.3 },
  { symbol: "GLNS", quote: "USDT", vol: 1.4e8, mockPrice: 2.54, change: 4.2 },
  { symbol: "SUKOON", quote: "USDT", vol: 5.1e7, mockPrice: 0.67, change: 1.9 },
  { symbol: "FBAY", display: "Falconbay", quote: "USDT", vol: 9.5e7, mockPrice: 1.09, change: 0.5 },
  { symbol: "GPC", quote: "USDT", vol: 3.7e7, mockPrice: 0.92, change: -0.8 },
  { symbol: "TRL", quote: "USDT", vol: 2.2e7, mockPrice: 0.31, change: 5.6 },
  { symbol: "SIDRALAND", display: "Sidraland", quote: "USDT", vol: 1.9e7, mockPrice: 0.44, change: -2.1 },
];

const QUOTES: Row["quote"][] = ["USDT", "FDUSD", "BNB", "BTC", "ALTS", "FIAT"];

function formatCurrency(num: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 6,
  }).format(num);
}

function formatVolume(vol: number) {
  if (vol >= 1e12) return `${(vol / 1e12).toFixed(2)}T`;
  if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
  if (vol >= 1e3) return `${(vol / 1e3).toFixed(2)}K`;
  return `${vol.toFixed(0)}`;
}

const PairName = ({ row }: { row: Row }) => {
  const name = row.display ?? row.symbol;
  return (
    <div className="flex items-center gap-2">
      <Star className="h-4 w-4 text-muted-foreground" aria-hidden />
      <div className="font-medium">{name}</div>
      <span className="text-muted-foreground">/ {row.quote}</span>
    </div>
  );
};

const ChangePill = ({ value }: { value: number }) => (
  <span
    className={cn(
      "inline-flex min-w-16 justify-center rounded-md px-2 py-1 text-sm",
      value >= 0 ? "bg-[hsl(var(--accent))/0.12] text-[hsl(var(--accent))]" : "bg-[hsl(var(--destructive))/0.12] text-[hsl(var(--destructive))]"
    )}
  >
    {value >= 0 ? "+" : ""}
    {value.toFixed(2)}%
  </span>
);

function RowItem({ row }: { row: Row }) {
  const { enabled: cryptoEnabled, lastPrice } = useBinanceTicker(row.symbol);
  const { enabled: commodityEnabled, price: commodityPrice, change: commodityChange, connected } = useCommodityPrice(row.symbol);
  
  // Use live prices when available
  const price = row.commodity && commodityEnabled && commodityPrice ? commodityPrice : 
                row.live && cryptoEnabled && lastPrice ? Number(lastPrice) : 
                row.mockPrice;
  
  const change = row.commodity && commodityEnabled && commodityChange !== undefined ? commodityChange : row.change;
  
  return (
    <TableRow className="hover:bg-accent/10 cursor-pointer transition-colors">
      <Link to={`/crypto/${row.symbol.toLowerCase()}`} className="contents">
        <TableCell>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <PairName row={row} />
                {row.commodity && connected && (
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded">
                    LIVE
                  </span>
                )}
                {row.live && cryptoEnabled && lastPrice && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                    LIVE
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">{formatVolume(row.vol)}</span>
            </div>
            <HalalComplianceIndicator symbol={row.symbol} compact />
          </div>
        </TableCell>
        <TableCell className="text-right font-medium">{formatCurrency(price)}</TableCell>
        <TableCell className="text-right">
          <ChangePill value={change} />
        </TableCell>
      </Link>
    </TableRow>
  );
}

export default function MarketsTable({ initialQuery = "" }: { initialQuery?: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quote, setQuote] = useState<Row["quote"]>("USDT");
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  useEffect(() => {
    // keep URL in sync with local state
    const next = new URLSearchParams(searchParams);
    const q = query.trim();
    if (q) next.set("q", q); else next.delete("q");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_MARKETS.filter((r) => r.quote === quote)
      .filter((r) =>
        q
          ? r.symbol.toLowerCase().includes(q) || (r.display ?? "").toLowerCase().includes(q)
          : true
      )
      .sort((a, b) => b.vol - a.vol);
  }, [quote, query]);

  return (
    <section aria-labelledby="markets-table-heading" className="grid gap-4">
      <Card className="card-elevated">
        <CardHeader className="py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle id="markets-table-heading" className="text-lg">Market List</CardTitle>
            <div className="flex items-center gap-2">
              {QUOTES.map((q) => (
                <Button
                  key={q}
                  size="sm"
                  variant={q === quote ? "default" : "secondary"}
                  onClick={() => setQuote(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="secondary">Spot</Badge>
            <div className="relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search Coin Pairs"
                aria-label="Search Coin Pairs"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const q = query.trim();
                    if (q) navigate(`/markets?q=${encodeURIComponent(q)}`);
                  }
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Name / Halal Status</TableHead>
                  <TableHead className="w-[25%] text-right">Last Price</TableHead>
                  <TableHead className="w-[25%] text-right">24h chg%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No matches
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => <RowItem key={`${row.symbol}-${row.quote}`} row={row} />)
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
