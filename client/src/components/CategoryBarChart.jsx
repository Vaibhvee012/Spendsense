import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import api from '../api/axios';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-surface border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-text text-xs font-medium mb-1">{d.category}</p>
      <p className="font-mono text-text text-sm">₹{d.current.toLocaleString('en-IN')}</p>
      {d.percentChange !== null && (
        <p className={`text-xs mt-0.5 ${d.percentChange > 0 ? 'text-orange-400' : 'text-accent'}`}>
          {d.percentChange > 0 ? '↑' : '↓'} {Math.abs(d.percentChange)}% vs last month
        </p>
      )}
    </div>
  );
};

const COLORS = ['#B6FF3C', '#22D3B8', '#f97316', '#3b82f6', '#ec4899', '#eab308', '#a855f7', '#ef4444', '#14b8a6', '#7FA396'];

const CategoryBarChart = ({ month, year }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      const now = new Date();
      const m = month || now.getMonth() + 1;
      const y = year || now.getFullYear();
      const { data } = await api.get(`/analytics/summary?month=${m}&year=${y}`);
      setData(data.categories.slice(0, 6));
      setLoading(false);
    };
    fetchSummary();
  }, [month, year]);
  
  if (loading) return <div className="h-64 flex items-center justify-center text-text-muted text-sm">Loading chart...</div>;
  if (data.length === 0) return <div className="h-64 flex items-center justify-center text-text-muted text-sm">No spending data yet.</div>;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="category" stroke="#7FA396" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#7FA396" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="current" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryBarChart;