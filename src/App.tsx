import { useState } from "react";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { Toaster } from "./components/ui/sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<"landing" | "dashboard">("landing");

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />

      <div className="pt-20">
        <ErrorBoundary>
          {currentPage === "landing" ? (
            <LandingPage onNavigate={setCurrentPage} />
          ) : (
            <Dashboard />
          )}
        </ErrorBoundary>
      </div>

      <Toaster />
    </div>
  );
}
