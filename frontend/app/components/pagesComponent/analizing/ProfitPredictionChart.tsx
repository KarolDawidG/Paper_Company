'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'chart.js/auto';

interface Prediction {
  month: string;
  profit: number;
}

interface Props {
  historicalData: Prediction[];
  monthsAhead?: number;
  t: any;
}

const ProfitPredictionChart: React.FC<Props> = ({ historicalData, monthsAhead = 3, t }) => {
  // Konwertujemy dane do regresji
  const x = historicalData.map((_, i) => i); // indeksy miesięcy
  const y = historicalData.map((p) => p.profit);

  const n = x.length;
  const avgX = x.reduce((a, b) => a + b, 0) / n;
  const avgY = y.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (x[i] - avgX) * (y[i] - avgY);
    denominator += (x[i] - avgX) ** 2;
  }

  const a = numerator / denominator;
  const b = avgY - a * avgX;

  // Przekształcamy dane do wykresu
  const allMonths: string[] = [];
  const allProfits: number[] = [];

  for (let i = 0; i < n + monthsAhead; i++) {
    const month = dayjs(historicalData[0].month).add(i, 'month').format('YYYY-MM');
    const profit = i < n ? y[i] : a * i + b;
    allMonths.push(month);
    allProfits.push(parseFloat(profit.toFixed(2)));
  }

  const chartData = {
    labels: allMonths,
    datasets: [
      {
        label: t?.monthlyReport?.actual || 'Zysk rzeczywisty',
        data: allProfits.slice(0, n),
        borderColor: 'green',
        backgroundColor: 'lightgreen',
        tension: 0.4,
      },
      {
        label: t?.monthlyReport?.predicted || 'Zysk prognozowany',
        data: [...Array(n).fill(null), ...allProfits.slice(n)],
        borderColor: 'blue',
        backgroundColor: 'lightblue',
        tension: 0.4,
        borderDash: [5, 5],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        ticks: {
          callback(this: any, value: string | number) {
            return `${value} zł`;
          },
        },
      },
    },
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>📉 {t?.monthlyReport?.trendPrediction || 'Prognoza trendu'}</Typography>
      <Line data={chartData} options={options} />
    </Box>
  );
};

export default ProfitPredictionChart;
