import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { CircularProgress, Typography, Grid } from '@mui/material';
import { notify } from '@/app/components/notification/Notify';
import axiosInstance from '@/app/api/axiosInstance';

interface SellerData {
  name: string;
  quantity: number;
  value: number;
}

const TopSellersChart = () => {
  const [data, setData] = useState<SellerData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<SellerData[]>('/data-analizing/top-sellers');
      const sorted = response.data.sort((a, b) => b.value - a.value);
      setData(sorted);
    } catch (error) {
      console.error('Błąd pobierania danych:', error);
      notify('Błąd pobierania danych o najlepszych sprzedawcach.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (data.length === 0) return <Typography>Brak danych do wyświetlenia.</Typography>;

  return (
    <Grid container spacing={4}>
      {/* Ilość */}
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>📦 Najlepsi sprzedawcy – liczba zamówień</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 40, left: 120, bottom: 20 }}
          >
            <XAxis type="number" />
            <YAxis
              dataKey="name"
              type="category"
              width={200}
              tick={{ fontSize: 14, fontWeight: 600 }}
            />
            <Tooltip formatter={(value: number) => `${value} szt.`} />
            <Legend />
            <Bar dataKey="quantity" fill="#8884d8" name="Ilość zamówień" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </Grid>

      {/* Wartość */}
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>💰 Najlepsi sprzedawcy – wartość sprzedaży</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 40, left: 120, bottom: 20 }}
          >
            <XAxis type="number" />
            <YAxis
              dataKey="name"
              type="category"
              width={200}
              tick={{ fontSize: 14, fontWeight: 600 }}
            />
            <Tooltip formatter={(value: number) => `${value.toFixed(2)} zł`} />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" name="Wartość (PLN)" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
};

export default TopSellersChart;
