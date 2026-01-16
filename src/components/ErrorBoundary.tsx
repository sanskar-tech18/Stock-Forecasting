import { useState } from "react";
import { Header } from "./Header";
import { LandingPage } from "./LandingPage";
import { Dashboard } from "./Dashboard";
import { Toaster } from "./ui/sonner";
import { ErrorBoundary } from "./ErrorBoundary";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'dashboard'>('landing');

  const handleNavigate = (page: 'landing' | 'dashboard') => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      
      <div className="pt-20">
        <ErrorBoundary>
          {currentPage === 'landing' ? (
            <LandingPage onNavigate={handleNavigate} />
          ) : (
            <Dashboard />
          )}
        </ErrorBoundary>
      </div>

      <Toaster 
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'hsl(var(--foreground))'
          }
        }}
      />
    </div>
  );
}
