import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { DashboardSidebar } from "./DashboardSidebar";
import { ForecastForm, ForecastParams } from "./ForecastForm";
import { MetaForecastResults } from "./MetaForecastResults";
import { Search, Bell, Clock, CheckCircle, AlertCircle, Activity, Sparkles, TrendingUp } from "lucide-react";
import { stockForecastAPI, ForecastResponse } from "../services/api";
import { toast } from "sonner";

const backendUrl = import.meta.env.VITE_API_BASE_URL ?? 'https://stock-forecasting-pw04.onrender.com';
console.log('=== DASHBOARD LOADED - CORRECT FILE - API INTEGRATED ===');
console.log('Backend API URL:', backendUrl);

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [forecastResults, setForecastResults] = useState<{
    symbol: string;
    days: number;
    results: any;
  } | null>(null);
  const [activityLog, setActivityLog] = useState<Array<{
    id: string;
    timestamp: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }>>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      message: 'Meta ensemble dashboard initialized successfully',
      type: 'success'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      message: 'ARIMA + LSTM models loaded and ready',
      type: 'info'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      message: 'NSE/BSE market data connection established',
      type: 'info'
    }
  ]);

  const handleForecastSubmit = async (params: ForecastParams) => {
    console.log('=== FORECAST SUBMIT CALLED ===');
    console.log('Params:', params);
    
    setIsLoading(true);
    
    // Add to activity log
    const newLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      message: `Starting Meta ensemble forecast for ${params.symbol} (${params.days} days)`,
      type: 'info' as const
    };
    setActivityLog(prev => [newLogEntry, ...prev]);

    try {
      let response: ForecastResponse;

      if (params.useMock) {
        console.log('=== Calling MOCK API endpoint ===');
        response = await stockForecastAPI.getMockForecast({
          symbol: params.symbol,
          forecast_days: params.days,
          totp: params.totp,
          use_angelone: params.useAngelOne
        });
      } else {
        console.log('=== Calling REAL API endpoint ===');
        response = await stockForecastAPI.getForecast({
          symbol: params.symbol,
          forecast_days: params.days,
          totp: params.totp,
          use_angelone: params.useAngelOne
        });
      }

      console.log('=== API Response received ===', response);

      if (!response.success) {
        throw new Error('Forecast request failed');
      }

      setForecastResults({
        symbol: params.symbol,
        days: params.days,
        results: response.results
      });

      const successLog = {
        id: (Date.now() + 1).toString(),
        timestamp: new Date().toISOString(),
        message: `Forecast completed for ${params.symbol}`,
        type: 'success' as const
      };
      setActivityLog(prev => [successLog, ...prev]);
    } catch (err: any) {
      console.error('Forecast error:', err);
      const errorLog = {
        id: (Date.now() + 2).toString(),
        timestamp: new Date().toISOString(),
        message: `Forecast error: ${err?.message || err}`,
        type: 'error' as const
      };
      setActivityLog(prev => [errorLog, ...prev]);
      toast.error('Forecast failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of component unchanged (rendering, UI)
  return (
    <div>{/* Dashboard UI omitted for brevity; unchanged */}</div>
  );
}
