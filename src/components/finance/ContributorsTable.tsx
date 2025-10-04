import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export type Contributor = {
  id: string;
  name: string;
  amount: number;
  date: string; // ISO
  source: "Internal Investment";
};

interface ContributorsTableProps {
  contributors: Contributor[];
  onDelete: (id: string) => void;
}

const currency = new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" });

const ContributorsTable = ({ contributors, onDelete }: ContributorsTableProps) => {
  const sorted = [...contributors].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Card className="card-elevated">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No contributions yet.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-right">{currency.format(c.amount)}</TableCell>
                  <TableCell>{new Date(c.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{c.source}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" aria-label={`Delete ${c.name}`} onClick={() => { onDelete(c.id); toast.success("Contribution removed"); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ContributorsTable;
