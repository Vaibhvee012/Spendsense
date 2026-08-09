import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TrendChart from '../components/TrendChart';
import CategoryBarChart from '../components/CategoryBarChart';
import GoalsCard from '../components/GoalsCard';
import MonthSelector from '../components/MonthSelector';

const Reports = () => {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  return (
    <div className="min-h-screen bg-bg text-text flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold mb-1">Reports</h1>
            <p className="text-text-muted text-sm">Trends, breakdowns, and your savings goals.</p>
          </div>
          <MonthSelector
            month={selectedMonth}
            year={selectedYear}
            onChange={(m, y) => { setSelectedMonth(m); setSelectedYear(y); }}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-surface border border-border rounded-2xl p-6">
            <p className="text-text-muted text-sm mb-4">Spending Trend</p>
            <TrendChart />
          </div>
          <div className="bg-surface border border-border rounded-2xl p-6">
            <p className="text-text-muted text-sm mb-4">Top Categories (this month)</p>
            <CategoryBarChart month={selectedMonth} year={selectedYear} />
          </div>
        </div>

        <GoalsCard />
      </div>
    </div>
  );
};

export default Reports;