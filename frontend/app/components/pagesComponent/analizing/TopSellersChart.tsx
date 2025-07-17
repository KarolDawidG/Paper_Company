import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CircularProgress, Typography } from '@mui/material';
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

  if (loading) {
    return <CircularProgress />;
  }

  if (data.length === 0) {
    return <Typography color="textSecondary">Brak danych do wyświetlenia.</Typography>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📊 Najlepsi sprzedawcy – ilość vs wartość sprzedaży</h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 40, left: 100, bottom: 20 }}
        >
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={150} />
          <Tooltip formatter={(value: number, name: string) => {
            return name === 'Ilość'
              ? [`${value}`, 'Ilość']
              : [`${value.toFixed(2)} zł`, 'Wartość (PLN)'];
          }} />
          <Legend />
          <Bar dataKey="quantity" fill="#8884d8" name="Ilość" barSize={15} />
          <Bar dataKey="value" fill="#82ca9d" name="Wartość (PLN)" barSize={15} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopSellersChart;
