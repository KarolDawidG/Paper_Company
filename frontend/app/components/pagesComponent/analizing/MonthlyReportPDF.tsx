'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, MenuItem, Select, CircularProgress, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import { Line } from 'react-chartjs-2';
import axiosInstance from '@/app/api/axiosInstance';
import dayjs from 'dayjs';
import 'chart.js/auto';
import useTranslation from '@/app/components/language/useTranslation';
import { pdf } from '@react-pdf/renderer';
import { MonthlyReportPDFDocument } from './MonthlyReportPDFDocument';
import ProfitPredictionChart from './ProfitPredictionChart';


interface MonthlyData {
  profit: number;
  clients: { name: string; quantity: number; value: number }[];
  sellers: { name: string; quantity: number; value: number }[];
  products: { name: string; quantity: number }[];
  predictions: { month: string; profit: number }[];
}

const MonthlyReportPDF = () => {
  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [data, setData] = useState<MonthlyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filename, setFilename] = useState<string>("");

  const fetchData = async (selectedMonth: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/data-analizing/monthly-report?month=${selectedMonth}`);
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Błąd pobierania danych:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(month);
  }, [month]);


const handleGeneratePDF = async () => {
  if (!data || !t) return;

  const blob = await pdf(
    <MonthlyReportPDFDocument
      t={t}
      profit={data.profit}
      clients={data.clients}
      sellers={data.sellers}
      products={data.products}
      predictions={data.predictions}
    />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const generatedFilename = `raport-${month}-${dayjs().format("YYYYMMDD")}.pdf`;

  setPdfBlobUrl(url);
  setFilename(generatedFilename);
  setIsModalOpen(true);
};

  const chartData = {
    labels: data?.predictions.map((p) => p.month),
    datasets: [
      {
        label: `${t.monthlyReport?.prediction || "Prognoza zysków"} (zł)`,
        data: data?.predictions.map((p) => p.profit),
        borderColor: 'green',
        backgroundColor: 'lightgreen',
        tension: 0.4,
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

  if (!t.monthlyReport) return <CircularProgress />;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>📊 {t.monthlyReport.title}</Typography>

      <Box mb={2}>
        <Typography>{t.monthlyReport.selectMonth}</Typography>
        <Select value={month} onChange={(e) => setMonth(e.target.value)} size="small">
          {[...Array(12)].map((_, i) => {
            const m = dayjs().subtract(i, 'month').format('YYYY-MM');
            return (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            );
          })}
        </Select>
      </Box>

      {loading && <CircularProgress />}


      {data && (
        <>
          <Typography variant="h6" mt={4}>📈 {t.monthlyReport.prediction}</Typography>
          <Box width="100%" height={300}>
            <Line data={chartData} options={options} />
          </Box>

          <Button variant="contained" color="primary" sx={{ mt: 4 }} onClick={handleGeneratePDF}>
            {t.monthlyReport?.viewReport || "Wyświetl raport"}
          </Button>

          <ProfitPredictionChart
            historicalData={data.predictions}
            t={t}
            monthsAhead={3}
          />
        </>
      )}


      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>{t.monthlyReport.preview}</DialogTitle>
        <DialogContent dividers style={{ height: "80vh", padding: 0 }}>
          {pdfBlobUrl && (
            <iframe
              src={`${pdfBlobUrl}#toolbar=0`}
              title="PDF Preview"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />

          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>
            {t.table?.close || "Zamknij"}
          </Button>

          <Button
              onClick={() => {
                if (pdfBlobUrl) {
                  const link = document.createElement("a");
                  link.href = pdfBlobUrl;
                  link.download = filename;
                  link.click();
                }
              }}
            >
              {t.table?.download || "Pobierz PDF"}
          </Button>


        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MonthlyReportPDF;
