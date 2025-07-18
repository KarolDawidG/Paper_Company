'use client';

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import { CircularProgress, Typography, Grid } from '@mui/material';
import { notify } from '@/app/components/notification/Notify';
import axiosInstance from '@/app/api/axiosInstance';
import { registerCharts } from '@/app/lib/registerCharts';

registerCharts();

interface ClientData {
  name: string;
  quantity: number;
  value: number;
}

const TopClientsChart = () => {
  const [data, setData] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<ClientData[]>('/data-analizing/top-clients');
      setData(response.data);
    } catch (error) {
      console.error('Błąd pobierania danych klientów:', error);
      notify('Nie udało się pobrać danych o klientach.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (data.length === 0) return <Typography>Brak danych do wyświetlenia.</Typography>;

  const labels = data.map((client) => client.name);

  const optionsCommon: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const quantityData = {
    labels,
    datasets: [
      {
        label: 'Ilość zamówień',
        data: data.map((c) => c.quantity),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const valueData = {
    labels,
    datasets: [
      {
        label: 'Wartość zakupów (PLN)',
        data: data.map((c) => c.value),
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.4)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>🛍️ Najwięksi klienci – ilość zamówień</Typography>
        <Line options={{ ...optionsCommon, plugins: { ...optionsCommon.plugins, title: { display: false } } }} data={quantityData} />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>💰 Najwięksi klienci – wartość zakupów</Typography>
        <Line options={{ ...optionsCommon, plugins: { ...optionsCommon.plugins, title: { display: false } } }} data={valueData} />
      </Grid>
    </Grid>
  );
};

export default TopClientsChart;
