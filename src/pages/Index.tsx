import { useEffect, useMemo, useRef, useState } from "react";
import SummaryCards from "@/components/finance/SummaryCards";
import ContributionForm, { NewContribution } from "@/components/finance/ContributionForm";
import ContributorsTable, { Contributor } from "@/components/finance/ContributorsTable";

const STORAGE_KEY = "regs_contributors";

const Index = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Spotlight interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100 + "%";
    const my = ((e.clientY - rect.top) / rect.height) * 100 + "%";
    e.currentTarget.style.setProperty("--mx", mx);
    e.currentTarget.style.setProperty("--my", my);
  };

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Contributor[];
        setContributors(parsed);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contributors));
  }, [contributors]);

  const addContribution = (data: NewContribution) => {
    const newEntry: Contributor = {
      id: crypto.randomUUID(),
      name: data.name,
      amount: data.amount,
      date: data.date,
      source: "Internal Investment",
    };
    setContributors((prev) => [newEntry, ...prev]);
  };

  const deleteContribution = (id: string) => {
    setContributors((prev) => prev.filter((c) => c.id !== id));
  };

  const totals = useMemo(() => ({
    amount: contributors.reduce((s, c) => s + c.amount, 0),
    count: contributors.length,
  }), [contributors]);

  useEffect(() => {
    document.title = "REGS Internal Investment — Cash Contributors";
  }, []);

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove} className="min-h-screen bg-background">
      <header className="interactive-spotlight">
        <div className="container mx-auto px-4 pt-16 pb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            REGS Internal Investment — Cash Contributors
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Track internal cash contributions effortlessly. Add entries, view totals, and manage contributors in one place.
          </p>
        </div>
      </header>
      <main className="container mx-auto px-4 pb-16">
        <section className="mt-4">
          <SummaryCards contributors={contributors} />
        </section>
        <section className="mt-8 grid lg:grid-cols-2 gap-6">
          <ContributionForm onAdd={addContribution} />
          <ContributorsTable contributors={contributors} onDelete={deleteContribution} />
        </section>
      </main>
    </div>
  );
};

export default Index;
