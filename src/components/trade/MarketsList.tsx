import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBinanceTicker } from "@/hooks/useBinanceTicker";
import { useNavigate } from "react-router-dom";

export type Market = {
  symbol: string;
  price: number;
  change: number; // percent
};

const MOCK_MARKETS: Market[] = [
  { symbol: "BTC", price: 68250, change: 1.8 },
  { symbol: "ETH", price: 3120, change: -0.7 },
  { symbol: "GLNS", price: 125.40, change: 4.2 },
  { symbol: "AIR", price: 78.50, change: -1.3 },
  { symbol: "REGS", price: 95.75, change: 7.5 },
  { symbol: "FBAY", price: 1.09, change: 0.5 },
  { symbol: "SUKOON", price: 0.67, change: 1.9 },
  { symbol: "Freet", price: 0.44, change: -2.1 },
  // Commodities
  { symbol: "GOLD", price: 2030.50, change: 1.25 },
  { symbol: "SILVER", price: 24.85, change: -0.45 },
  { symbol: "OIL", price: 78.30, change: 2.15 },
  { symbol: "WHEAT", price: 685.25, change: 0.85 },
  { symbol: "COPPER", price: 8.45, change: -1.20 },
  { symbol: "COFFEE", price: 1.65, change: 3.20 },
];

interface MarketsListProps {
  symbols: string[];
  selected: string;
  onSelect: (symbol: string) => void;
}

// Row component with live price for BTC/ETH
const MarketRow = ({
  symbol, mockPrice, change, selected, onClick,
}: {
  symbol: string;
  mockPrice: number;
  change: number;
  selected: boolean;
  onClick: () => void;
}) => {
  const { enabled, lastPrice } = useBinanceTicker(symbol);
  const displayPrice = enabled && lastPrice ? lastPrice : mockPrice;
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-md border px-3 py-2 text-left transition-colors",
        "hover:bg-accent/10",
        selected ? "border-primary bg-primary/5" : "border-border"
      )}
      aria-pressed={selected}
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">{symbol}/USDT</div>
        <div className="text-sm text-muted-foreground">${displayPrice.toLocaleString()}</div>
      </div>
      <div className="mt-1 text-sm">
        <span className={cn(change >= 0 ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--destructive))]")}> 
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)}%
        </span>
      </div>
    </button>
  );
};

const MarketsList = ({ symbols, selected, onSelect }: MarketsListProps) => {
  const markets = MOCK_MARKETS.filter((m) => symbols.includes(m.symbol));
  const navigate = useNavigate();

  const handleMarketClick = (symbol: string) => {
    // Navigate to detailed trading view
    navigate(`/trading/${symbol}USDT`);
  };

  return (
    <Card className="card-elevated h-full">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">Markets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
{markets.map((m) => (
  <MarketRow
    key={m.symbol}
    symbol={m.symbol}
    mockPrice={m.price}
    change={m.change}
    selected={selected === m.symbol}
    onClick={() => handleMarketClick(m.symbol)}
  />
))}
        <div className="pt-2">
          <Button variant="secondary" className="w-full">View all</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketsList;
