import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiArrowUpLine, RiArrowDownLine, RiInformationLine, RiSparkling2Line } from 'react-icons/ri';
import api from '../api/axios';

const InsightsCard = ({ month, year }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/analytics/insights?month=${month}&year=${year}`);
        setInsights(data.insights);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [month, year]);

  const getIcon = (type) => {
    if (type === 'warning') return RiArrowUpLine;
    if (type === 'positive') return RiArrowDownLine;
    return RiInformationLine;
  };

  const getColor = (type) => {
    if (type === 'warning') return 'text-orange-400 bg-orange-400/10';
    if (type === 'positive') return 'text-accent bg-accent/10';
    return 'text-accent-2 bg-accent-2/10';
  };

  if (loading) return null;
  if (insights.length === 0) return null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <RiSparkling2Line className="text-accent" size={18} />
        <h2 className="font-display font-semibold text-text">Insights</h2>
      </div>

      <div className="space-y-2">
        {insights.map((insight, i) => {
          const Icon = getIcon(insight.type);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-3 bg-surface-light border border-border rounded-xl px-4 py-3"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getColor(insight.type)}`}>
                <Icon size={15} />
              </div>
              <p className="text-text text-sm">{insight.text}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default InsightsCard;