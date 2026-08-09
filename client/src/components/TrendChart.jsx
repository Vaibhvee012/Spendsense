import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../api/axios';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-lg px-3 py-2 shadow-xl">
      <p className="text-text-muted text-xs mb-1">{label}</p>
      <p className="font-mono text-accent text-sm font-semibold">
        ₹{payload[0].value.toLocaleString('en-IN')}
      </p>
    </div>
  );
};

const TrendChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrend = async () => {
      const { data } = await api.get('/analytics/trend?months=6');
      const formatted = data.trend.map((t) => ({
        label: `${MONTH_NAMES[t.month - 1]} ${t.year}`,
        total: t.total,
      }));
      setData(formatted);
      setLoading(false);
    };
    fetchTrend();
  }, []);

  if (loading) return <div className="h-64 flex items-center justify-center text-text-muted text-sm">Loading chart...</div>;
  if (data.length === 0) return <div className="h-64 flex items-center justify-center text-text-muted text-sm">Not enough data yet.</div>;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B6FF3C" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#B6FF3C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="label" stroke="#7FA396" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#7FA396" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="total" stroke="#B6FF3C" strokeWidth={2} fill="url(#trendGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;