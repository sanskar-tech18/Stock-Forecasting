# Stock Forecasting API & Frontend

...

Note: In the frontend code the base backend URL is controlled by the Vite env variable `VITE_API_BASE_URL`. In production you should set this in Vercel to your Render URL (for example `https://stock-forecasting-pw04.onrender.com`). Locally the app defaults to `http://localhost:5000`.

Example React fetch (use the Vite env variable in your app builds):

```javascript
// Frontend code to call your API
const BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://stock-forecasting-pw04.onrender.com';

const forecast = async () => {
  const totp = prompt("Enter your 6-digit TOTP code:");

  const response = await fetch(`${BASE}/api/forecast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      totp: totp,
      symbol: 'RELIANCE-EQ',
      use_angelone: true,
      forecast_days: 7
    })
  });

  const data = await response.json();

  if (data.success) {
    console.log('Forecast:', data.results.forecast);
    console.log('Accuracy:', data.results.metrics);
  }
};
```

Local testing (still valid for running server on your machine):
- Start the backend locally: `python stock_forecast_api.py` (listens on `http://localhost:5000` by default for local dev)
- Serve frontend locally: `python -m http.server 8000` from project root and open `http://127.0.0.1:8000/frontend/index.html`

...
