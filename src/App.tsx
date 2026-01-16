import { useState } from "react";
import { Header } from "./Header";
import { LandingPage } from "./LandingPage";
import { Dashboard } from "./Dashboard";
import { Toaster } from "./ui/sonner";
import { ErrorBoundary } from "./ErrorBoundary";

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
