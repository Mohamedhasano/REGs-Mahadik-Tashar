import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Calculator, 
  Plus, 
  Trash2, 
  DollarSign, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Info,
  History,
  Download,
  Moon,
  Coins,
  Wallet
} from 'lucide-react';
import { api } from '../lib/api';
import { toast } from 'sonner';

interface Asset {
  type: 'crypto' | 'cash' | 'gold' | 'silver' | 'stocks' | 'other';
  name: string;
  amount: number;
  valueUSD: number;
}

interface ZakatResult {
  totalWealthUSD: number;
  nisabValueUSD: number;
  meetsNisab: boolean;
  zakatDueUSD: number;
  zakatRate: number;
  percentageAboveNisab: string;
}

interface NisabInfo {
  metalPrices: {
    gold: { pricePerGram: number; currency: string };
    silver: { pricePerGram: number; currency: string };
  };
  nisab: {
    gold: { grams: number; valueUSD: number };
    silver: { grams: number; valueUSD: number };
  };
  zakatRate: string;
  recommendation: string;
}

const ZakatCalculator = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [assets, setAssets] = useState<Asset[]>([
    { type: 'crypto', name: 'Bitcoin', amount: 0, valueUSD: 0 }
  ]);
  const [nisabType, setNisabType] = useState<'gold' | 'silver'>('silver');
  const [hawlCompleted, setHawlCompleted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [zakatResult, setZakatResult] = useState<ZakatResult | null>(null);
  const [nisabInfo, setNisabInfo] = useState<NisabInfo | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load Nisab values on mount
  useEffect(() => {
    loadNisabValues();
  }, []);

  const loadNisabValues = async () => {
    try {
      const response = await api.get('/zakat/nisab');
      setNisabInfo(response.data);
    } catch (error: any) {
      console.error('Error loading Nisab values:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await api.get('/zakat/history?limit=20');
      setHistory(response.data.calculations || []);
    } catch (error: any) {
      console.error('Error loading history:', error);
      toast.error('Failed to load history');
    }
  };

  const addAsset = () => {
    setAssets([...assets, { type: 'crypto', name: '', amount: 0, valueUSD: 0 }]);
  };

  const removeAsset = (index: number) => {
    if (assets.length > 1) {
      setAssets(assets.filter((_, i) => i !== index));
    }
  };

  const updateAsset = (index: number, field: keyof Asset, value: any) => {
    const newAssets = [...assets];
    newAssets[index] = { ...newAssets[index], [field]: value };
    setAssets(newAssets);
  };

  const calculateZakat = async () => {
    // Validate assets
    const validAssets = assets.filter(a => a.name && a.valueUSD > 0);
    if (validAssets.length === 0) {
      toast.error('Please add at least one asset with a valid value');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/zakat/calculate', {
        assets: validAssets,
        nisabType,
        hawlCompleted
      });

      setZakatResult(response.data.calculation);
      toast.success('✅ Zakat calculated successfully!');
    } catch (error: any) {
      console.error('Error calculating Zakat:', error);
      toast.error(error.response?.data?.message || 'Failed to calculate Zakat');
    } finally {
      setLoading(false);
    }
  };

  const resetCalculator = () => {
    setAssets([{ type: 'crypto', name: '', amount: 0, valueUSD: 0 }]);
    setZakatResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Zakat Calculator
              </span>
            </h1>
            <p className="text-muted-foreground mt-2">
              حاسبة الزكاة - Calculate your Islamic wealth tax (2.5%)
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setShowHistory(!showHistory);
              if (!showHistory) loadHistory();
            }}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            History
          </Button>
        </div>

        {!showHistory ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Calculator */}
            <div className="lg:col-span-2 space-y-6">
              {/* Nisab Information Card */}
              {nisabInfo && (
                <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Moon className="h-6 w-6 text-emerald-400" />
                    <h2 className="text-xl font-bold">Nisab Threshold</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-card/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Coins className="h-5 w-5 text-yellow-500" />
                        <span className="font-semibold">Gold</span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-500">
                        ${nisabInfo.nisab.gold.valueUSD.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {nisabInfo.nisab.gold.grams}g × ${nisabInfo.metalPrices.gold.pricePerGram}/g
                      </div>
                    </div>
                    <div className="p-4 bg-card/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Coins className="h-5 w-5 text-gray-400" />
                        <span className="font-semibold">Silver (Recommended)</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-400">
                        ${nisabInfo.nisab.silver.valueUSD.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {nisabInfo.nisab.silver.grams}g × ${nisabInfo.metalPrices.silver.pricePerGram}/g
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm">
                      <Info className="h-4 w-4 inline mr-2" />
                      {nisabInfo.recommendation}
                    </p>
                  </div>
                </Card>
              )}

              {/* Assets Input Card */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Wallet className="h-6 w-6" />
                    Your Assets
                  </h2>
                  <Button onClick={addAsset} size="sm" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Asset
                  </Button>
                </div>

                <div className="space-y-4">
                  {assets.map((asset, index) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Asset #{index + 1}</span>
                        {assets.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAsset(index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-semibold mb-1 block">Type</label>
                          <select
                            value={asset.type}
                            onChange={(e) => updateAsset(index, 'type', e.target.value)}
                            className="w-full p-2 bg-background border border-border rounded-lg"
                          >
                            <option value="crypto">Crypto</option>
                            <option value="cash">Cash</option>
                            <option value="gold">Gold</option>
                            <option value="silver">Silver</option>
                            <option value="stocks">Stocks</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-1 block">Name</label>
                          <Input
                            type="text"
                            placeholder="e.g., Bitcoin, USD"
                            value={asset.name}
                            onChange={(e) => updateAsset(index, 'name', e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-1 block">Amount</label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={asset.amount || ''}
                            onChange={(e) => updateAsset(index, 'amount', parseFloat(e.target.value) || 0)}
                            step="0.01"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold mb-1 block">Value (USD)</label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={asset.valueUSD || ''}
                            onChange={(e) => updateAsset(index, 'valueUSD', parseFloat(e.target.value) || 0)}
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Settings */}
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Nisab Calculation Based On:</label>
                    <div className="flex gap-3">
                      <Button
                        variant={nisabType === 'gold' ? 'default' : 'outline'}
                        onClick={() => setNisabType('gold')}
                        className="flex-1"
                      >
                        Gold
                      </Button>
                      <Button
                        variant={nisabType === 'silver' ? 'default' : 'outline'}
                        onClick={() => setNisabType('silver')}
                        className="flex-1"
                      >
                        Silver (Recommended)
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <input
                      type="checkbox"
                      id="hawl"
                      checked={hawlCompleted}
                      onChange={(e) => setHawlCompleted(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <label htmlFor="hawl" className="text-sm">
                      I confirm that my wealth has been held for a full lunar year (Hawl)
                    </label>
                  </div>
                </div>

                {/* Calculate Button */}
                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={calculateZakat}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    {loading ? 'Calculating...' : (
                      <>
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculate Zakat
                      </>
                    )}
                  </Button>
                  <Button onClick={resetCalculator} variant="outline">
                    Reset
                  </Button>
                </div>
              </Card>
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {zakatResult ? (
                <>
                  {/* Result Card */}
                  <Card className="p-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-500/50">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-emerald-400" />
                      Zakat Calculation
                    </h2>

                    <div className="space-y-4">
                      {/* Total Wealth */}
                      <div>
                        <div className="text-sm text-muted-foreground">Total Wealth</div>
                        <div className="text-3xl font-bold text-white">
                          ${zakatResult.totalWealthUSD.toFixed(2)}
                        </div>
                      </div>

                      {/* Nisab Status */}
                      <div className="p-3 bg-card/50 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">Nisab Status</div>
                        <div className="flex items-center gap-2">
                          {zakatResult.meetsNisab ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-emerald-500" />
                              <span className="font-semibold text-emerald-500">Meets Nisab</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-5 w-5 text-red-500" />
                              <span className="font-semibold text-red-500">Below Nisab</span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Threshold: ${zakatResult.nisabValueUSD.toFixed(2)}
                        </div>
                      </div>

                      {/* Zakat Due */}
                      {zakatResult.meetsNisab && (
                        <div className="p-4 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg">
                          <div className="text-sm text-emerald-100">Zakat Due</div>
                          <div className="text-4xl font-bold text-white">
                            ${zakatResult.zakatDueUSD.toFixed(2)}
                          </div>
                          <div className="text-xs text-emerald-100 mt-1">
                            {(zakatResult.zakatRate * 100).toFixed(1)}% of total wealth
                          </div>
                        </div>
                      )}

                      {/* Additional Info */}
                      {zakatResult.meetsNisab && (
                        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                          <div className="text-xs text-muted-foreground">
                            Your wealth is {zakatResult.percentageAboveNisab}% above Nisab
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Islamic Info Card */}
                  <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <Info className="h-5 w-5 text-purple-400" />
                      Islamic Guidelines
                    </h3>
                    <ul className="text-xs text-muted-foreground space-y-2">
                      <li>• Zakat is 2.5% of qualifying wealth</li>
                      <li>• Wealth must be held for one lunar year (Hawl)</li>
                      <li>• Must meet or exceed Nisab threshold</li>
                      <li>• Includes cash, gold, silver, stocks, crypto</li>
                      <li>• Give to 8 categories mentioned in Quran</li>
                      <li>• Purifies wealth and helps the needy</li>
                    </ul>
                  </Card>
                </>
              ) : (
                <Card className="p-6 text-center">
                  <Calculator className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-bold mb-2">No Calculation Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your assets and click "Calculate Zakat" to see results
                  </p>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /* History View */
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <History className="h-6 w-6" />
                Calculation History
              </h2>
              <Button onClick={() => setShowHistory(false)} variant="outline">
                Back to Calculator
              </Button>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12">
                <History className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No calculation history yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((calc) => (
                  <div
                    key={calc._id}
                    className="p-4 bg-muted/30 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold">
                        ${calc.totalWealthUSD.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Zakat Due: ${calc.zakatDueUSD.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(calc.calculationDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      {calc.isPaid ? (
                        <Badge className="bg-emerald-600">Paid</Badge>
                      ) : (
                        <Badge variant="outline">Unpaid</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ZakatCalculator;

