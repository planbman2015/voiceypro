import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackgroundCanvas from './components/BackgroundCanvas';
import LandingPage from './pages/LandingPage';
import BrowsePage from './pages/BrowsePage';
import VoiceProfilePage from './pages/VoiceProfilePage';
import SubmitVoicePage from './pages/SubmitVoicePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import PricingPage from './pages/PricingPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import DMCAPage from './pages/DMCAPage';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackgroundCanvas />
      <div className="flex flex-col min-h-screen relative" style={{ zIndex: 1 }}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/voice/:id" element={<VoiceProfilePage />} />
            <Route path="/submit" element={<SubmitVoicePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/dmca" element={<DMCAPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}
