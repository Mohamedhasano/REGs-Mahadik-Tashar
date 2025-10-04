export type HalalCategory = 
  | "stocks" 
  | "etfs" 
  | "commodities" 
  | "sukuk" 
  | "reits" 
  | "cryptocurrency" 
  | "forex";

export type HalalStatus = "halal" | "haram" | "questionable" | "pending";

export interface HalalCondition {
  name: string;
  description: string;
  isCompliant: boolean;
}

export interface ScreeningRule {
  rule: string;
  description: string;
  threshold?: string;
}

export interface HalalAsset {
  symbol: string;
  category: HalalCategory;
  status: HalalStatus;
  conditions: HalalCondition[];
  screeningRules: ScreeningRule[];
  examples: string[];
  lastReviewed: string;
  certifiedBy?: string;
}

export const HALAL_CATEGORIES: Record<HalalCategory, {
  name: string;
  conditions: string[];
  examples: string[];
  screeningRules: ScreeningRule[];
}> = {
  stocks: {
    name: "Stocks (Equities)",
    conditions: [
      "Company's core business is halal",
      "Debt < 30%", 
      "Interest income < 5%",
      "No haram sectors"
    ],
    examples: ["Apple", "Microsoft", "Halal food companies"],
    screeningRules: [
      {
        rule: "Avoid haram sectors",
        description: "Avoid alcohol, pork, gambling, interest-based banks/insurance"
      },
      {
        rule: "Financial ratios",
        description: "Financial ratios within Shariah limits",
        threshold: "Debt < 30%, Interest income < 5%"
      }
    ]
  },
  etfs: {
    name: "ETFs / Mutual Funds",
    conditions: ["Fund follows Shariah-compliant index"],
    examples: ["SPUS ETF", "HLAL ETF", "Wahed FTSE USA Shariah ETF"],
    screeningRules: [
      {
        rule: "Shariah certification",
        description: "Must be Shariah-certified and screened regularly"
      }
    ]
  },
  commodities: {
    name: "Commodities (Spot)",
    conditions: ["Physical, tangible assets", "Immediate settlement"],
    examples: ["Gold", "Silver", "Oil", "Wheat"],
    screeningRules: [
      {
        rule: "Spot trading only",
        description: "Spot trading only (T+0), no interest-based futures"
      }
    ]
  },
  sukuk: {
    name: "Sukuk (Islamic Bonds)",
    conditions: ["Asset-backed (ijarah, mudarabah, musharakah)", "No fixed interest"],
    examples: ["Government Sukuk", "Corporate Sukuk"],
    screeningRules: [
      {
        rule: "Shariah board approval",
        description: "Must be approved by Shariah boards"
      }
    ]
  },
  reits: {
    name: "REITs (Real Estate)",
    conditions: ["Income from halal properties", "No haram tenants"],
    examples: ["Manulife Shariah REIT", "KLCC REIT"],
    screeningRules: [
      {
        rule: "No haram tenants",
        description: "No casinos, alcohol bars, etc."
      },
      {
        rule: "Interest income limit",
        description: "Income from interest < 5%"
      }
    ]
  },
  cryptocurrency: {
    name: "Cryptocurrency (Approved)",
    conditions: ["Asset-backed or utility-based", "Not meme/speculative coins"],
    examples: ["Bitcoin (debated)", "Ethereum (debated)", "Gold-backed crypto"],
    screeningRules: [
      {
        rule: "Intrinsic value",
        description: "Must have intrinsic value, avoid haram use cases"
      }
    ]
  },
  forex: {
    name: "Forex (Spot)",
    conditions: ["Immediate currency exchange (hand-to-hand)"],
    examples: ["USD/EUR spot trade"],
    screeningRules: [
      {
        rule: "No margin/swaps",
        description: "No margin, no overnight swaps (interest)"
      }
    ]
  }
};