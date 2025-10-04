import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HalalComplianceIndicator } from "@/components/trade/HalalComplianceIndicator";
import { useHalalCategories } from "@/hooks/useHalalCompliance";
import { HALAL_CATEGORIES, HalalCategory } from "@/types/halal";
import { Shield, BookOpen, TrendingUp, AlertTriangle, CheckCircle2, Scroll } from "lucide-react";

export default function HalalCompliance() {
  const [selectedCategory, setSelectedCategory] = useState<HalalCategory>("stocks");
  const categories = useHalalCategories();

  useEffect(() => {
    document.title = "Halal Trading Guide — Shariah-Compliant Investment | REGS Global";
    const desc = "Complete guide to halal trading and Shariah-compliant investments. Learn Islamic finance principles, screening rules, and approved trading categories.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { 
      meta = document.createElement("meta"); 
      meta.setAttribute("name", "description"); 
      document.head.appendChild(meta); 
    }
    meta.setAttribute("content", desc);
    
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) { 
      link = document.createElement("link"); 
      link.setAttribute("rel", "canonical"); 
      document.head.appendChild(link); 
    }
    link.setAttribute("href", window.location.origin + "/halal-compliance");
  }, []);

  const popularAssets = ["REGS", "GLNS", "AIRLAND", "GOLD", "SILVER", "COFFEE", "REAL_ESTATE"];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-semibold gradient-text">Halal Trading Guide</h1>
          </div>
          <p className="text-muted-foreground">
            Comprehensive Shariah-compliant investment guidelines and screening rules for ethical trading
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Overview Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="h-8 w-8 text-accent" />
                <div>
                  <h3 className="font-semibold">Halal Categories</h3>
                  <p className="text-sm text-muted-foreground">7 approved investment types</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Scroll className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Screening Rules</h3>
                  <p className="text-sm text-muted-foreground">Islamic finance compliance</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-8 w-8 text-accent" />
                <div>
                  <h3 className="font-semibold">Live Monitoring</h3>
                  <p className="text-sm text-muted-foreground">Real-time compliance tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Asset Compliance Status */}
        <section>
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Popular Assets Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularAssets.map((symbol) => {
                  const isCommod = ["GOLD", "SILVER", "COFFEE", "REAL_ESTATE"].includes(symbol);
                  const displayName = isCommod ? 
                    (symbol === "REAL_ESTATE" ? "Real Estate" : 
                     symbol === "COFFEE" ? "Coffee" :
                     symbol === "GOLD" ? "Gold" : "Silver") : symbol;
                  
                  return (
                    <div key={symbol} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{displayName}</h4>
                          {isCommod && <span className="text-xs text-muted-foreground">Commodity</span>}
                        </div>
                      </div>
                      {isCommod ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="default">COMMODITY</Badge>
                          <span className="text-sm text-muted-foreground">100% compliant</span>
                        </div>
                      ) : (
                        <HalalComplianceIndicator symbol={symbol} />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Detailed Categories */}
        <section>
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Halal Trading Categories & Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as HalalCategory)}>
                <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-6">
                  {Object.entries(HALAL_CATEGORIES).map(([key, category]) => (
                    <TabsTrigger key={key} value={key} className="text-xs">
                      {category.name.split(' ')[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(HALAL_CATEGORIES).map(([key, category]) => (
                  <TabsContent key={key} value={key}>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-accent" />
                              Halal Conditions
                            </h4>
                            <ul className="space-y-2">
                              {category.conditions.map((condition, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                                  <span className="text-sm">{condition}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              Examples
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {category.examples.map((example, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {example}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            Screening Rules (Shariah)
                          </h4>
                          <div className="space-y-3">
                            {category.screeningRules.map((rule, index) => (
                              <div key={index} className="p-4 border rounded-lg bg-muted/30">
                                <div className="font-medium text-sm mb-1">{rule.rule}</div>
                                <div className="text-sm text-muted-foreground">{rule.description}</div>
                                {rule.threshold && (
                                  <div className="text-sm text-primary mt-2">
                                    <strong>Threshold:</strong> {rule.threshold}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </section>

        {/* Additional Resources */}
        <section>
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Islamic Finance Principles</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Learn the fundamental principles of Islamic finance including prohibition of Riba (interest), 
                    Gharar (excessive uncertainty), and Haram sectors.
                  </p>
                  <Button variant="outline" size="sm">Learn More</Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Shariah Compliance Certification</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Understand how our Shariah board reviews and certifies trading instruments for compliance 
                    with Islamic principles.
                  </p>
                  <Button variant="outline" size="sm">View Certificates</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}