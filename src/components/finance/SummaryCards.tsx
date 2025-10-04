import { Card, CardContent } from "@/components/ui/card";

export type Contributor = {
  id: string;
  name: string;
  amount: number;
  date: string; // ISO
  source: "Internal Investment";
};

interface SummaryCardsProps {
  contributors: Contributor[];
}

const currency = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

const SummaryCards = ({ contributors }: SummaryCardsProps) => {
  const total = contributors.reduce((sum, c) => sum + c.amount, 0);
  const count = contributors.length;

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <Card className="card-elevated">
        <CardContent className="p-6 text-left">
          <p className="text-sm text-muted-foreground">Total Raised</p>
          <p className="mt-2 text-3xl font-semibold">{currency.format(total)}</p>
        </CardContent>
      </Card>
      <Card className="card-elevated">
        <CardContent className="p-6 text-left">
          <p className="text-sm text-muted-foreground">Contributors</p>
          <p className="mt-2 text-3xl font-semibold">{count}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;
