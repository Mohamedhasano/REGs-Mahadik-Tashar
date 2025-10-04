import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  TrendingUp, 
  Shield, 
  Zap, 
  Globe, 
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Users,
  BarChart3,
  Coins,
  Building2,
  Wallet,
  Star,
  ChevronRight,
  Play,
  Check
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function Home() {
  const [stats, setStats] = useState({
    users: 0,
    volume: 0,
    tokens: 0,
    countries: 0
  });

  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    // Animate numbers
    const interval = setInterval(() => {
      setStats(prev => ({
        users: Math.min(prev.users + 500, 50000),
        volume: Math.min(prev.volume + 100, 2500),
        tokens: Math.min(prev.tokens + 100, 10000),
        countries: Math.min(prev.countries + 1, 150)
      }));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-amber-500/20">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              {/* Animated glow rings */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse" style={{animationDelay: '0.5s'}}></div>
              
              <img 
                src="/regs-logo.jpg" 
                alt="REGs Global Logo" 
                className="relative w-14 h-14 object-cover rounded-full border-2 border-amber-500/30 group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl"
              />
            </div>
            <div>
              <div className="font-black text-2xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent drop-shadow-lg">
                REGs GLOBAL
              </div>
              <div className="text-xs text-amber-400/70 font-semibold tracking-wider">
                POWERED BY SIDRA CHAIN
              </div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {['Markets', 'Trade', 'Earn', 'Halal'].map((item) => (
              <Link 
                key={item}
                to={`/${item.toLowerCase()}`} 
                className="text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-amber-400">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-bold shadow-lg shadow-amber-500/50 hover:shadow-xl hover:shadow-amber-500/70 transition-all">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Premium */}
      <section className="relative pt-32 pb-24 px-4">
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-6xl mx-auto">
            {/* Floating Logo */}
            <div className="mb-8 flex justify-center animate-fade-in">
              <div className="relative">
                {/* Multiple glow layers */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full blur-2xl opacity-30 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
                
                <img 
                  src="/regs-logo.jpg" 
                  alt="REGs Global" 
                  className="relative w-32 h-32 md:w-40 md:h-40 object-cover rounded-full border-4 border-amber-500/30 drop-shadow-2xl hover:scale-110 transition-transform duration-700"
                />
                
                {/* Orbiting stars */}
                <div className="absolute inset-0 animate-spin" style={{animationDuration: '20s'}}>
                  <Star className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-4 text-amber-400" />
                </div>
                <div className="absolute inset-0 animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}>
                  <Star className="absolute bottom-0 right-0 h-3 w-3 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Premium Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border-2 border-amber-400/30 backdrop-blur-sm mb-8 animate-fade-in">
              <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
              <span className="text-sm font-bold bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                World's First Sharia-Compliant RWA Exchange
              </span>
              <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold px-3 py-1 shadow-lg shadow-emerald-500/50">
                LIVE NOW
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none animate-fade-in">
              <span className="block mb-2 text-white drop-shadow-2xl">Trade Halal</span>
              <span className="block bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-2xl">
                Assets With
              </span>
              <span className="block text-white drop-shadow-2xl">Confidence</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in">
              Access <span className="font-black text-amber-400">10,000+ Sharia-compliant tokens</span> on the revolutionary{' '}
              <span className="font-bold text-blue-400">Sidra Chain</span> ecosystem.
              Built for the Muslim Ummah, trusted by millions worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-fade-in">
              <Link to="/signup?ref=WELCOME">
                <Button size="lg" className="h-16 px-10 text-lg font-black bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 shadow-2xl shadow-amber-500/50 hover:shadow-3xl hover:shadow-amber-500/70 hover:scale-105 transition-all duration-300 group">
                  <Sparkles className="mr-2 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                  Start Trading Now
                  <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/halal-compliance">
                <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-bold border-2 border-amber-400/50 text-amber-300 hover:bg-amber-400/10 hover:border-amber-400 backdrop-blur-sm group">
                  <Shield className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                  View Certification
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Button size="lg" variant="ghost" className="h-16 px-10 text-lg font-semibold text-slate-300 hover:text-amber-400 group">
                <Play className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Badges - Enhanced */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm animate-fade-in">
              {[
                { icon: CheckCircle2, text: '100% Sharia-Compliant', color: 'emerald' },
                { icon: Shield, text: 'Audited by Islamic Scholars', color: 'blue' },
                { icon: Award, text: 'No Riba, No Gharar', color: 'purple' },
                { icon: Lock, text: 'Bank-Level Security', color: 'amber' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 group cursor-pointer">
                  <div className={`p-2 rounded-lg bg-${item.color}-500/20 group-hover:bg-${item.color}-500/30 transition-colors`}>
                    <item.icon className={`h-5 w-5 text-${item.color}-400 group-hover:scale-110 transition-transform`} />
                  </div>
                  <span className="text-slate-300 font-semibold group-hover:text-amber-400 transition-colors">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 max-w-6xl mx-auto">
            {[
              { icon: Users, label: 'Active Users', value: `${stats.users.toLocaleString()}+`, color: 'from-blue-500 to-cyan-500' },
              { icon: BarChart3, label: '24h Volume', value: `$${stats.volume.toLocaleString()}M+`, color: 'from-emerald-500 to-green-500' },
              { icon: Coins, label: 'Halal Tokens', value: `${stats.tokens.toLocaleString()}+`, color: 'from-amber-500 to-yellow-500' },
              { icon: Globe, label: 'Countries', value: `${stats.countries}+`, color: 'from-purple-500 to-pink-500' }
            ].map((stat, idx) => (
              <Card key={idx} className="relative p-8 text-center bg-slate-900/50 border-2 border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:-translate-y-2 group backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-black mb-2 bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400 font-semibold uppercase tracking-wider">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>
          </div>
        </section>

      {/* Features Section - Luxury */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 text-sm font-bold px-6 py-2 shadow-lg shadow-amber-500/50">
              Why Choose REGs Global
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              The <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Premium</span> Way to Trade
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Experience the perfect fusion of Islamic principles and cutting-edge blockchain technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Sharia-Compliant',
                description: 'Every asset reviewed and certified by our board of Islamic scholars',
                gradient: 'from-emerald-500 to-green-600',
                features: ['100% Halal', 'Scholar Board', 'Continuous Monitoring']
              },
              {
                icon: Building2,
                title: 'Real World Assets',
                description: 'Trade tokenized real estate, gold, silver, and more with full transparency',
                gradient: 'from-blue-500 to-cyan-600',
                features: ['Real Estate', 'Precious Metals', 'Commodities']
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Powered by Sidra Chain for instant transactions and minimal fees',
                gradient: 'from-purple-500 to-pink-600',
                features: ['Instant Trades', 'Low Fees', 'High Speed']
              },
              {
                icon: Lock,
                title: 'Bank-Level Security',
                description: 'Multi-layer security with cold storage and insurance protection',
                gradient: 'from-amber-500 to-yellow-600',
                features: ['Cold Storage', '2FA', 'Insurance']
              },
              {
                icon: Wallet,
                title: 'Easy Deposits',
                description: 'Support for fiat, crypto, and local payment methods',
                gradient: 'from-rose-500 to-red-600',
                features: ['Bank Transfer', 'Cards', 'P2P']
              },
              {
                icon: Award,
                title: 'Tier 1 Exchange',
                description: 'Competing with Binance & OKX in liquidity and features',
                gradient: 'from-indigo-500 to-blue-600',
                features: ['High Liquidity', 'Advanced Tools', 'Pro Features']
              }
            ].map((feature, idx) => (
              <Card 
                key={idx} 
                className={`relative p-10 bg-slate-900/50 border-2 ${activeFeature === idx ? 'border-amber-500/80 shadow-2xl shadow-amber-500/20' : 'border-slate-800'} hover:border-amber-500/50 transition-all duration-500 group cursor-pointer backdrop-blur-sm overflow-hidden`}
                onMouseEnter={() => setActiveFeature(idx)}
              >
                {/* Background gradient effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                
                <h3 className="relative text-2xl font-black mb-4 text-white group-hover:text-amber-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="relative text-slate-300 leading-relaxed mb-6 group-hover:text-slate-200 transition-colors">
                  {feature.description}
                </p>

                <div className="relative space-y-2">
                  {feature.features.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-400 group-hover:text-amber-300 transition-colors">
                      <Check className="h-4 w-4" />
                      <span>{item}</span>
                    </div>
                  ))}
                    </div>

                {/* Hover arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-6 w-6 text-amber-400" />
                  </div>
              </Card>
            ))}
          </div>
          </div>
        </section>

      {/* Sidra Chain Section - Enhanced */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto relative z-10">
          <div className="relative rounded-3xl p-16 md:p-20 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            
            <div className="relative z-10 max-w-3xl">
              <Badge className="mb-6 bg-white/20 text-white border-0 text-sm font-bold px-6 py-2 backdrop-blur-sm">
                Powered by Sidra Chain
              </Badge>
              <h2 className="text-5xl md:text-6xl font-black mb-8 text-white drop-shadow-2xl">
                Built on the Revolutionary
                <span className="block mt-2 bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  Sidra Start Initiative
                </span>
              </h2>
              <p className="text-xl text-blue-100 mb-10 leading-relaxed drop-shadow-lg">
                REGs Global operates on the Sidra Chain ecosystem, providing unmatched speed, 
                security, and scalability for Islamic finance. Join the future of halal digital assets.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/markets">
                  <Button size="lg" className="h-14 px-8 bg-white text-indigo-600 hover:bg-amber-50 font-black shadow-2xl hover:shadow-3xl hover:scale-105 transition-all">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Explore Markets
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-8 border-2 border-white/50 text-white hover:bg-white/10 hover:border-white backdrop-blur-sm font-bold">
                  Learn About Sidra Chain
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <Sparkles className="h-16 w-16 mx-auto mb-6 text-amber-400 animate-pulse" />
            <h2 className="text-5xl md:text-6xl font-black mb-8">
              Ready to Start Your <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">Halal</span> Trading Journey?
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
              Join thousands of Muslims worldwide trading with peace of mind and Sharia compliance
            </p>
            <Link to="/signup?ref=CTA">
              <Button size="lg" className="h-16 px-16 text-xl font-black bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 shadow-2xl shadow-amber-500/50 hover:shadow-3xl hover:shadow-amber-500/70 hover:scale-110 transition-all duration-300 group">
                <Users className="mr-3 h-6 w-6 group-hover:scale-125 transition-transform" />
                Create Free Account
                <Star className="ml-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
              </Button>
            </Link>
          </div>
        </div>
        </section>

      {/* Footer - Premium */}
      <footer className="border-t border-slate-800/50 py-16 px-4 bg-slate-950/50 backdrop-blur-sm relative">
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="/regs-logo.jpg" 
                  alt="REGs Global" 
                  className="w-12 h-12 object-cover rounded-full border-2 border-amber-500/30"
                />
                <span className="font-black text-xl bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  REGs GLOBAL
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                The world's first Sharia-compliant RWA exchange on Sidra Chain. Trade with confidence.
              </p>
            </div>
            
            {[
              { title: 'Products', links: ['Markets', 'Spot Trading', 'Earn', 'Wallet'] },
              { title: 'Company', links: ['Halal Certification', 'Community', 'Referral Program', 'Support'] },
              { title: 'Legal', links: ['Terms of Service', 'Privacy Policy', 'Sharia Compliance'] }
            ].map((section, idx) => (
              <div key={idx}>
                <h4 className="font-bold mb-4 text-amber-400">{section.title}</h4>
                <ul className="space-y-3 text-sm text-slate-400">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="hover:text-amber-400 transition-colors flex items-center gap-2 group">
                        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-800/50 text-center">
            <p className="text-sm text-slate-500">
              © 2025 REGs Global. Built with ❤️ for the Muslim Ummah. 
              <span className="text-amber-400 font-semibold"> Powered by Sidra Chain</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
