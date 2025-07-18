import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { CircularProgress, Typography } from '@mui/material';
import axiosInstance from '@/app/api/axiosInstance';
import { notify } from '@/app/components/notification/Notify';

interface ProductData {
  name: string;
  quantity: number;
}

const TopProductsChart = () => {
  const [data, setData] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<ProductData[]>('/data-analizing/top-product');
      const sorted = response.data.sort((a, b) => b.quantity - a.quantity);
      setData(sorted);
    } catch (error) {
      console.error('Błąd pobierania danych produktów:', error);
      notify('Nie udało się pobrać danych o produktach.');
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
    <div>
      <Typography variant="h6" gutterBottom>📦 Najczęściej sprzedawane produkty</Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" hide /> {/* ukrywamy oś Y */}
          <Tooltip formatter={(value: number) => `${value} szt.`} />
          <Bar dataKey="quantity" fill="#8884d8" name="Ilość sprzedana">
            <LabelList dataKey="name" position="insideLeft" style={{ fill: '#fff', fontSize: 12 }} />
            <LabelList dataKey="quantity" position="insideRight" style={{ fill: '#fff', fontWeight: 'bold' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductsChart;
