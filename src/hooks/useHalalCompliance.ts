import { useMemo } from "react";
import { HalalAsset, HalalCategory, HalalStatus, HALAL_CATEGORIES } from "@/types/halal";

// Mock data for halal compliance
const HALAL_ASSETS: Record<string, HalalAsset> = {
  REGS: {
    symbol: "REGS",
    category: "cryptocurrency",
    status: "halal",
    conditions: [
      { name: "Shariah Compliant", description: "Certified by Islamic scholars", isCompliant: true },
      { name: "Asset-backed", description: "Backed by real-world assets", isCompliant: true },
      { name: "No Interest", description: "No interest-based mechanisms", isCompliant: true }
    ],
    screeningRules: HALAL_CATEGORIES.cryptocurrency.screeningRules,
    examples: ["REGS Global Token"],
    lastReviewed: "2024-01-20",
    certifiedBy: "REGS Shariah Board"
  },
  GLNS: {
    symbol: "GLNS",
    category: "cryptocurrency",
    status: "halal",
    conditions: [
      { name: "Utility Purpose", description: "Powers decentralized applications", isCompliant: true },
      { name: "Shariah Reviewed", description: "Reviewed by Islamic finance experts", isCompliant: true }
    ],
    screeningRules: HALAL_CATEGORIES.cryptocurrency.screeningRules,
    examples: ["Utility token"],
    lastReviewed: "2024-01-18"
  },
  AIRLAND: {
    symbol: "AIRLAND", 
    category: "cryptocurrency",
    status: "halal",
    conditions: [
      { name: "Real Estate Backed", description: "Backed by physical real estate", isCompliant: true },
      { name: "No Speculation", description: "Asset-backed value", isCompliant: true }
    ],
    screeningRules: HALAL_CATEGORIES.cryptocurrency.screeningRules,
    examples: ["Real estate token"],
    lastReviewed: "2024-01-17"
  },
  SOL: {
    symbol: "SOL",
    category: "cryptocurrency",
    status: "questionable", 
    conditions: [
      { name: "Blockchain Platform", description: "Powers decentralized applications", isCompliant: true },
      { name: "DeFi Concerns", description: "Platform enables interest-based protocols", isCompliant: false }
    ],
    screeningRules: HALAL_CATEGORIES.cryptocurrency.screeningRules,
    examples: ["Solana platform token"],
    lastReviewed: "2024-01-16"
  },
  BNB: {
    symbol: "BNB",
    category: "cryptocurrency",
    status: "questionable",
    conditions: [
      { name: "Exchange Utility", description: "Used for trading fee discounts", isCompliant: true },
      { name: "Centralized Exchange", description: "Associated with traditional finance practices", isCompliant: false }
    ],
    screeningRules: HALAL_CATEGORIES.cryptocurrency.screeningRules,
    examples: ["Exchange utility token"],
    lastReviewed: "2024-01-14"
  },
  XRP: {
    symbol: "XRP",
    category: "cryptocurrency",
    status: "questionable",
    conditions: [
      { name: "Payment System", description: "Facilitates cross-border payments", isCompliant: true },
      { name: "Banking Partnerships", description: "Works with traditional banking system", isCompliant: false }
    ],
    screeningRules: HALAL_CATEGORIES.cryptocurrency.screeningRules,
    examples: ["Payment token"],
    lastReviewed: "2024-01-13"
  },
  DOGE: {
    symbol: "DOGE",
    category: "cryptocurrency", 
    status: "haram",
    conditions: [
      { name: "Meme Origin", description: "Created as a joke/meme", isCompliant: false },
      { name: "No Intrinsic Value", description: "Purely speculative asset", isCompliant: false }
    ],
    screeningRules: HALAL_CATEGORIES.cryptocurrency.screeningRules,
    examples: ["Meme cryptocurrency"],
    lastReviewed: "2024-01-12"
  },
  GOLD: {
    symbol: "GOLD",
    category: "commodities",
    status: "halal",
    conditions: [
      { name: "Physical Asset", description: "Tangible precious metal", isCompliant: true },
      { name: "Store of Value", description: "Historically stable value store", isCompliant: true },
      { name: "Spot Trading", description: "Immediate settlement without interest", isCompliant: true }
    ],
    screeningRules: HALAL_CATEGORIES.commodities.screeningRules,
    examples: ["Gold Spot"],
    lastReviewed: "2024-01-20",
    certifiedBy: "REGS Shariah Board"
  },
  SILVER: {
    symbol: "SILVER",
    category: "commodities",
    status: "halal",
    conditions: [
      { name: "Physical Asset", description: "Tangible precious metal", isCompliant: true },
      { name: "Industrial Use", description: "Has practical applications", isCompliant: true },
      { name: "Spot Trading", description: "Immediate settlement without interest", isCompliant: true }
    ],
    screeningRules: HALAL_CATEGORIES.commodities.screeningRules,
    examples: ["Silver Spot"],
    lastReviewed: "2024-01-20",
    certifiedBy: "REGS Shariah Board"
  },
  COFFEE: {
    symbol: "COFFEE",
    category: "commodities",
    status: "halal",
    conditions: [
      { name: "Agricultural Product", description: "Natural, tangible commodity", isCompliant: true },
      { name: "Essential Good", description: "Widely consumed beverage", isCompliant: true },
      { name: "Spot Trading", description: "Immediate settlement without interest", isCompliant: true }
    ],
    screeningRules: HALAL_CATEGORIES.commodities.screeningRules,
    examples: ["Arabica Coffee"],
    lastReviewed: "2024-01-19",
    certifiedBy: "REGS Shariah Board"
  },
  REAL_ESTATE: {
    symbol: "REAL_ESTATE",
    category: "commodities",
    status: "halal",
    conditions: [
      { name: "Physical Asset", description: "Backed by real estate properties", isCompliant: true },
      { name: "Tangible Value", description: "Has intrinsic physical value", isCompliant: true },
      { name: "Spot Trading", description: "Immediate settlement without interest", isCompliant: true }
    ],
    screeningRules: HALAL_CATEGORIES.commodities.screeningRules,
    examples: ["Real Estate Index"],
    lastReviewed: "2024-01-18",
    certifiedBy: "REGS Shariah Board"
  }
};

export function useHalalCompliance(symbol: string) {
  return useMemo(() => {
    const asset = HALAL_ASSETS[symbol.toUpperCase()];
    if (!asset) {
      return {
        status: "pending" as HalalStatus,
        category: "cryptocurrency" as HalalCategory,
        conditions: [],
        screeningRules: [],
        isCompliant: false,
        complianceScore: 0,
        lastReviewed: new Date().toISOString(),
        certifiedBy: undefined as string | undefined
      };
    }

    const compliantConditions = asset.conditions.filter(c => c.isCompliant).length;
    const totalConditions = asset.conditions.length;
    const complianceScore = totalConditions > 0 ? (compliantConditions / totalConditions) * 100 : 0;
    const isCompliant = asset.status === "halal";

    return {
      ...asset,
      isCompliant,
      complianceScore
    };
  }, [symbol]);
}

export function useHalalCategories() {
  return HALAL_CATEGORIES;
}

export function getHalalStatusColor(status: HalalStatus) {
  switch (status) {
    case "halal":
      return "hsl(var(--accent))";
    case "haram": 
      return "hsl(var(--destructive))";
    case "questionable":
      return "hsl(45 93% 47%)"; // orange
    case "pending":
      return "hsl(var(--muted-foreground))";
    default:
      return "hsl(var(--muted-foreground))";
  }
}

export function getHalalStatusBadgeVariant(status: HalalStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "halal":
      return "default";
    case "haram":
      return "destructive"; 
    case "questionable":
      return "secondary";
    case "pending":
      return "outline";
    default:
      return "outline";
  }
}