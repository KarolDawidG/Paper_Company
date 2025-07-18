'use client';
import React, { useEffect, useState } from 'react';
import { CircularProgress, Grid, Typography, MenuItem, TextField, Card, CardContent} from '@mui/material';
import axiosInstance from '@/app/api/axiosInstance';
import { notify } from '@/app/components/notification/Notify';

type Client = { name: string; quantity: number; value: number };
type Seller = { name: string; quantity: number; value: number };
type Product = { name: string; quantity: number };

interface SummaryResponse {
  clients: Client[];
  sellers: Seller[];
  products: Product[];
  profit: number;
}

const generateMonths = () => {
  const months: string[] = [];
  const current = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(current.getFullYear(), current.getMonth() - i, 1);
    months.push(date.toISOString().slice(0, 7));
  }
  return months;
};

const MonthlySummary = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(generateMonths()[0]);
  const [data, setData] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const months = generateMonths();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get<SummaryResponse>(
        `/data-analizing/monthly-summary?month=${selectedMonth}&lang=pl`
      );
      setData(res.data);
    } catch (err) {
      console.error('Błąd pobierania danych:', err);
      notify('Nie udało się pobrać danych miesięcznych.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>📅 Podsumowanie miesięczne</Typography>

      <TextField
        select
        label="Wybierz miesiąc"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        sx={{ mb: 4, width: 200 }}
      >
        {months.map((month) => (
          <MenuItem key={month} value={month}>
            {month}
          </MenuItem>
        ))}
      </TextField>

      {loading ? (
        <CircularProgress />
      ) : data ? (
        <Grid container spacing={4}>
          {/* Zysk */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5">💰 Zysk całkowity:</Typography>
                <Typography variant="h4" color="green">{data.profit.toFixed(2)} zł</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Klienci */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">🏢 Top Klienci</Typography>
                {data.clients.map((c, i) => (
                  <Typography key={i}>
                    {i + 1}. {c.name} — {c.quantity} szt. / {c.value.toFixed(2)} zł
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Sprzedawcy */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">👨‍💼 Top Sprzedawcy</Typography>
                {data.sellers.map((s, i) => (
                  <Typography key={i}>
                    {i + 1}. {s.name} — {s.quantity} szt. / {s.value.toFixed(2)} zł
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Produkty */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">📦 Najpopularniejsze Produkty</Typography>
                {data.products.map((p, i) => (
                  <Typography key={i}>
                    {i + 1}. {p.name} — {p.quantity} szt.
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography>Brak danych do wyświetlenia.</Typography>
      )}
    </div>
  );
};

export default MonthlySummary;
