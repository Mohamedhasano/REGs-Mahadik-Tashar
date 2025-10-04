import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface TraderCardProps {
  name: string;
  tag?: string;
  subscribers: number;
  pnl30d: number; // USD
  roi30d: number; // %
  assets: number; // USD
  series: number[]; // sparkline values
}

function formatNumber(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function initials(name: string) {
  return name
    .split(/\s|_/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export default function TraderCard({ name, tag, subscribers, pnl30d, roi30d, assets, series }: TraderCardProps) {
  const max = Math.max(...series);
  const min = Math.min(...series);
  const width = 120;
  const height = 40;
  const points = series
    .map((v, i) => {
      const x = (i / (series.length - 1)) * width;
      const y = height - ((v - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="py-4">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="font-medium truncate max-w-[180px]">{name}</div>
              {tag ? (
                <span className="text-xs px-2 py-0.5 rounded bg-muted text-foreground/80">{tag}</span>
              ) : null}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{subscribers.toLocaleString()} Subscribers</div>

            <div className="mt-3 grid grid-cols-3 gap-4 items-end">
              <div>
                <div className="text-xs text-muted-foreground">30D PnL (USD)</div>
                <div className="text-lg font-semibold text-[hsl(var(--accent))]">+{formatNumber(pnl30d)}</div>
                <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mt-1">
                  <polyline
                    fill="none"
                    stroke="hsl(var(--accent))"
                    strokeWidth="2"
                    points={points}
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">30D ROI</div>
                <div className="font-semibold text-[hsl(var(--accent))]">+{roi30d.toFixed(2)}%</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Assets (USD)</div>
                <div className="font-medium">{formatNumber(assets)}</div>
                <Button size="sm" className="mt-2">Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
