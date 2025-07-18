import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  RadialLinearScale,
} from 'chart.js';

export const registerCharts = () => {
  Chart.register(
    ArcElement,
    BarElement,
    CategoryScale,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    RadialLinearScale
  );
};
