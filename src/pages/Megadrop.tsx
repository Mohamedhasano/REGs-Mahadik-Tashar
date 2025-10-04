import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Headphones, Network, Users, Gift } from "lucide-react";

interface ProjectItem {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  status: "Ended" | "Live" | "Upcoming";
  network: string;
  participants?: number;
  rewards?: string;
  color?: string; // tailwind bg token suffix
}

const projects: ProjectItem[] = [
  {
    id: "kerneldao",
    name: "KernelDAO",
    date: "2025-04-14",
    status: "Ended",
     network: "Sidra Chain",
    participants: 1758158,
    rewards: "40M KERNEL",
    color: "bg-primary/10",
  },
  {
    id: "solv",
    name: "Solv Protocol",
    date: "2025-01-18",
    status: "Ended",
     network: "Sidra Chain",
    participants: 1327684,
    rewards: "588M SOLV",
    color: "bg-accent/10",
  },
  {
    id: "lista",
    name: "Lista",
    date: "2024-06-20",
    status: "Ended",
     network: "Sidra Chain",
    participants: 1247412,
    rewards: "100M LISTA",
    color: "bg-secondary/20",
  },
  {
    id: "bouncebit",
    name: "BounceBit",
    date: "2024-05-13",
    status: "Ended",
    network: "Sidra Chain",
    participants: 822609,
    rewards: "—",
    color: "bg-muted",
  },
];

const formatNumber = (n?: number) =>
  typeof n === "number" ? n.toLocaleString() : "—";

const Megadrop: React.FC = () => {
  const navigate = useNavigate();

  // SEO: title, description, canonical, structured data
  useEffect(() => {
    document.title = "REGS Global — Sharia-Compliant Digital Assets Exchange";

    const ensureMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    ensureMeta(
      "description",
      "REGS Global: Sharia-compliant digital assets exchange for 10,000+ halal tokens. Built under Sidra Start initiative on Sidra Chain ecosystem, aiming to be a Tier 1 exchange for Islamic finance."
    );

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `${window.location.origin}/megadrop`;

    // Structured data: ItemList of projects
    const data = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'CreativeWork',
          name: p.name,
          startDate: p.date,
        },
      })),
    };

    const id = "megadrop-jsonld";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(data);

    return () => {
      // keep SEO tags; no cleanup
    };
  }, []);

  const list = useMemo(() => projects, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-semibold">REGS Global</h1>
          <div aria-hidden className="text-muted-foreground">
            <Headphones className="h-5 w-5" />
          </div>
        </div>
        <div className="container mx-auto px-4 pb-4">
          <p className="text-sm text-muted-foreground">
            Sharia-compliant digital assets exchange offering 10,000+ halal tokens. Built under Sidra Start initiative on Sidra Chain ecosystem - your Tier 1 platform for Islamic finance trading.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        <section aria-labelledby="megadrop-list" className="space-y-3">
          <h2 id="megadrop-list" className="sr-only">Megadrop projects</h2>
          {list.map((p) => (
            <article key={p.id}>
              <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full grid place-items-center ${p.color ?? "bg-muted"}`}>
                      <Gift className="h-5 w-5 text-foreground/80" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{p.name}</CardTitle>
                      <p className="text-xs text-muted-foreground">{p.date}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{p.status}</Badge>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-2 sm:gap-4 text-sm">
                  <div className="col-span-3 sm:col-span-1 flex items-center gap-2">
                    <Network className="h-4 w-4 text-muted-foreground" />
                    <div className="truncate">
                      <p className="text-muted-foreground">Supported Network</p>
                      <p className="font-medium">{p.network}</p>
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-1 flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Participants</p>
                      <p className="font-medium">{formatNumber(p.participants)}</p>
                    </div>
                  </div>
                  <div className="col-span-3 sm:col-span-1 flex items-center gap-2">
                    <Gift className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Quest Rewards</p>
                      <p className="font-medium">{p.rewards ?? "—"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Megadrop;
