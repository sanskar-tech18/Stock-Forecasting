import React, { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { DashboardSidebar } from "./DashboardSidebar";
import { ForecastForm, ForecastParams } from "./ForecastForm";
import { MetaForecastResults } from "./MetaForecastResults";
import {
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp
} from "lucide-react";
import { stockForecastAPI, ForecastResponse } from "../services/api";
import { toast } from "sonner";

const backendUrl =
  import.meta.env.VITE_API_BASE_URL ??
  "stock-forecasting-production-07c1.up.railway.app";

console.log("=== DASHBOARD LOADED ===");
console.log("Backend API URL:", backendUrl);

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [forecastResults, setForecastResults] = useState<{
    symbol: string;
    days: number;
    results: any;
  } | null>(null);

  const [activityLog, setActivityLog] = useState<
    Array<{
      id: string;
      timestamp: string;
      message: string;
      type: "info" | "success" | "warning" | "error";
    }>
  >([
    {
      id: "1",
      timestamp: new Date().toISOString(),
      message: "Meta ensemble dashboard initialized successfully",
      type: "success"
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      message: "ARIMA + LSTM models loaded and ready",
      type: "info"
    }
  ]);

  const handleForecastSubmit = async (params: ForecastParams) => {
    setIsLoading(true);

    setActivityLog(prev => [
      {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        message: `Running forecast for ${params.symbol}`,
        type: "info"
      },
      ...prev
    ]);

    try {
      let response: ForecastResponse;

      if (params.useMock) {
        response = await stockForecastAPI.getMockForecast({
          symbol: params.symbol,
          forecast_days: params.days,
          totp: params.totp,
          use_angelone: params.useAngelOne
        });
      } else {
        response = await stockForecastAPI.getForecast({
          symbol: params.symbol,
          forecast_days: params.days,
          totp: params.totp,
          use_angelone: params.useAngelOne
        });
      }

      if (!response.success) {
        throw new Error("Forecast request failed");
      }

      setForecastResults({
        symbol: params.symbol,
        days: params.days,
        results: response.results
      });

      setActivityLog(prev => [
        {
          id: (Date.now() + 1).toString(),
          timestamp: new Date().toISOString(),
          message: `Forecast completed for ${params.symbol}`,
          type: "success"
        },
        ...prev
      ]);
    } catch (err: any) {
      toast.error("Forecast failed");
      setActivityLog(prev => [
        {
          id: (Date.now() + 2).toString(),
          timestamp: new Date().toISOString(),
          message: err?.message ?? "Unknown error",
          type: "error"
        },
        ...prev
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Stock Forecast Dashboard
          </h1>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Center Panel */}
          <ScrollArea className="flex-1 p-6">
            <ForecastForm
              isLoading={isLoading}
              onSubmit={handleForecastSubmit}
            />

            {forecastResults && (
              <MetaForecastResults
                symbol={forecastResults.symbol}
                days={forecastResults.days}
                results={forecastResults.results}
              />
            )}
          </ScrollArea>

          {/* Activity Panel */}
          <div className="w-[340px] border-l p-4">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity Log
            </h2>

            <ScrollArea className="h-[calc(100vh-160px)]">
              <div className="space-y-3">
                {activityLog.map(log => (
                  <div
                    key={log.id}
                    className="text-sm border rounded-md p-3"
                  >
                    <div className="flex items-center gap-2">
                      {log.type === "success" && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {log.type === "error" && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      {log.type === "info" && (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium">{log.message}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
