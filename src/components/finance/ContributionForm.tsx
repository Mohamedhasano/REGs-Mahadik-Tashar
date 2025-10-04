import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";

export type NewContribution = {
  name: string;
  amount: number;
  date: string;
};

interface ContributionFormProps {
  onAdd: (data: NewContribution) => void;
}

const ContributionForm = ({ onAdd }: ContributionFormProps) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!name.trim()) {
      toast.error("Please enter a contributor name.");
      return;
    }
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    onAdd({ name: name.trim(), amount: parsed, date });
    toast.success("Contribution added");
    setName("");
    setAmount("");
    setDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle>Add Contribution</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2 text-left">
            <Label htmlFor="name">Contributor Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Jane Doe" />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input id="amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 5000" />
          </div>
          <div className="grid gap-2 text-left">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">Add</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContributionForm;
