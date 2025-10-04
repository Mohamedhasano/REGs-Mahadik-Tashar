import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Trade from "./pages/Trade";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Markets from "./pages/Markets";
import P2P from "./pages/P2P";
import Smart from "./pages/Smart";
import Assets from "./pages/Assets";
import Transfer from "./pages/Transfer";
import Profile from "./pages/Profile";
import Megadrop from "./pages/Megadrop";
import Referral from "./pages/Referral";
import Square from "./pages/Square";
import Earn from "./pages/Earn";
import Commodities from "./pages/Commodities";
import HalalCompliance from "./pages/HalalCompliance";
import CryptoDetail from "./pages/CryptoDetail";
import TradingPair from "./pages/TradingPair";
import TraderDashboard from "./pages/TraderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ShariahBoardDashboard from "./pages/ShariahBoardDashboard";
import SupportDashboard from "./pages/SupportDashboard";
import ProjectsDashboard from "./pages/ProjectsDashboard";
import KYCVerification from "./pages/KYCVerification";
import Verifications from "./pages/Verifications";
import ZakatCalculator from "./pages/ZakatCalculator";
import BottomNav from "./components/layout/BottomNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
        <BrowserRouter>
          <div className="min-h-screen pb-20 md:pb-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/trade" element={<Trade />} />
              <Route path="/smart" element={<Smart />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/transfer" element={<Transfer />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/contributors" element={<Index />} />
              <Route path="/p2p" element={<P2P />} />
              <Route path="/megadrop" element={<Megadrop />} />
              <Route path="/referral" element={<Referral />} />
              <Route path="/square" element={<Square />} />
              <Route path="/earn" element={<Earn />} />
              <Route path="/commodities" element={<Commodities />} />
              <Route path="/halal-compliance" element={<HalalCompliance />} />
              <Route path="/crypto/:symbol" element={<CryptoDetail />} />
              <Route path="/trading/:pair" element={<TradingPair />} />
              {/* Role-based Dashboards */}
              <Route path="/trader-dashboard" element={<TraderDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/shariah-board-dashboard" element={<ShariahBoardDashboard />} />
              <Route path="/support-dashboard" element={<SupportDashboard />} />
              <Route path="/projects-dashboard" element={<ProjectsDashboard />} />
              {/* KYC Verification */}
              <Route path="/kyc-verification" element={<KYCVerification />} />
              {/* Verifications */}
              <Route path="/verifications" element={<Verifications />} />
              <Route path="/zakat-calculator" element={<ZakatCalculator />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <BottomNav />
        </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
