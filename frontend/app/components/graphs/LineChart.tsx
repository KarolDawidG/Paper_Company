"use client";

import { Line } from "react-chartjs-2";
import { registerCharts } from "@/app/lib/registerCharts";
import { ChartOptions } from "chart.js";

registerCharts();

const options: ChartOptions<"line"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "📈 Miesięczny trend sprzedaży – Produkty A i B",
    },
  },
};

const labels = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec"];

const data = {
  labels,
  datasets: [
    {
      label: "Produkt A",
      data: [120, 135, 125, 145, 160, 150, 170],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      tension: 0.4,
    },
    {
      label: "Produkt B",
      data: [80, 75, 95, 100, 110, 105, 120],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      tension: 0.4,
    },
  ],
};

const LineChart = () => {
  return <Line options={options} data={data} />;
};

export default LineChart;
