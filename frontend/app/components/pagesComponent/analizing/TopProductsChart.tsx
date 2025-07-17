import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { CircularProgress, Typography } from '@mui/material';
import { notify } from '@/app/components/notification/Notify';
import axiosInstance from '@/app/api/axiosInstance';

interface ProductData {
  name: string;
  quantity: number;
}

const TopProductsChart = () => {
  const [data, setData] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<ProductData[]>('/data-analizing/top-product');
      const sorted = response.data.sort((a, b) => b.quantity - a.quantity);
      setData(sorted);
    } catch (error) {
      console.error('Błąd pobierania danych:', error);
      notify('Błąd pobierania najlepiej sprzedających się towarów.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (data.length === 0) {
    return <Typography color="textSecondary">Brak danych do wyświetlenia.</Typography>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">📈 Najlepiej sprzedające się towary</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={150} />
          <Tooltip />
          <Bar dataKey="quantity" fill="#ffc658" name="Ilość" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductsChart;
