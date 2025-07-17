import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { topClients } from './testdata';

const TopClientsChart = () => (
  <>
    <h2 className="text-xl font-bold mb-2">🛍️ Najwięksi klienci (ilość i wartość)</h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={topClients}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="quantity" fill="#a4de6c" name="Ilość" />
        <Bar dataKey="value" fill="#d0ed57" name="Wartość (PLN)" />
      </BarChart>
    </ResponsiveContainer>
  </>
);

export default TopClientsChart;
