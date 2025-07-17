import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { topSellers } from './testdata';

const TopSellersChart = () => (
  <div>
    <h2 className="text-xl font-bold mb-2">📊 Najlepsi sprzedawcy (ilość i wartość)</h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={topSellers}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="quantity" fill="#8884d8" name="Ilość" />
        <Bar dataKey="value" fill="#82ca9d" name="Wartość (PLN)" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default TopSellersChart;
