const Transaction = require('../models/Transaction');

// Helper: get start/end date range for a given month/year
const getMonthRange = (month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  return { start, end };
};

// @route GET /api/analytics/summary?month=8&year=2026
// Returns spend-by-category for current month vs previous month, with % change
const getMonthlySummary = async (req, res) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    // Previous month (handles January -> rolls back to December of prior year)
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = year - 1;
    }

    const current = getMonthRange(month, year);
    const previous = getMonthRange(prevMonth, prevYear);

    // Single aggregation: group by category AND which period (current/previous) it falls in
    const results = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'expense',
          date: { $gte: previous.start, $lt: current.end },
        },
      },
      {
        $addFields: {
          period: {
            $cond: [
              { $and: [{ $gte: ['$date', current.start] }, { $lt: ['$date', current.end] }] },
              'current',
              'previous',
            ],
          },
        },
      },
      {
        $group: {
          _id: { category: '$category', period: '$period' },
          total: { $sum: '$amount' },
        },
      },
    ]);

    // Reshape into { category: { current, previous } }
    const byCategory = {};
    results.forEach((r) => {
      const cat = r._id.category;
      if (!byCategory[cat]) byCategory[cat] = { current: 0, previous: 0 };
      byCategory[cat][r._id.period] = r.total;
    });

    // Compute % change and totals per category
    const categories = Object.entries(byCategory).map(([category, { current, previous }]) => {
      let percentChange = null;
      if (previous > 0) {
        percentChange = Math.round(((current - previous) / previous) * 100);
      } else if (current > 0) {
        percentChange = 100; // new spending category vs zero last month
      }
      return { category, current, previous, percentChange };
    });

    const totalCurrent = categories.reduce((sum, c) => sum + c.current, 0);
    const totalPrevious = categories.reduce((sum, c) => sum + c.previous, 0);
    const totalPercentChange =
      totalPrevious > 0 ? Math.round(((totalCurrent - totalPrevious) / totalPrevious) * 100) : null;

    res.json({
      month,
      year,
      totalCurrent,
      totalPrevious,
      totalPercentChange,
      categories: categories.sort((a, b) => b.current - a.current),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/analytics/insights?month=8&year=2026
// Turns the raw numbers into human-readable sentences
const getInsights = async (req, res) => {
  try {
    const now = new Date();
    const month = Number(req.query.month) || now.getMonth() + 1;
    const year = Number(req.query.year) || now.getFullYear();

    // Reuse the same logic by calling the aggregation directly (not via HTTP)
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = year - 1;
    }

    const current = getMonthRange(month, year);
    const previous = getMonthRange(prevMonth, prevYear);

    const results = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'expense',
          date: { $gte: previous.start, $lt: current.end },
        },
      },
      {
        $addFields: {
          period: {
            $cond: [
              { $and: [{ $gte: ['$date', current.start] }, { $lt: ['$date', current.end] }] },
              'current',
              'previous',
            ],
          },
        },
      },
      {
        $group: {
          _id: { category: '$category', period: '$period' },
          total: { $sum: '$amount' },
        },
      },
    ]);

    const byCategory = {};
    results.forEach((r) => {
      const cat = r._id.category;
      if (!byCategory[cat]) byCategory[cat] = { current: 0, previous: 0 };
      byCategory[cat][r._id.period] = r.total;
    });

    const insights = [];

    Object.entries(byCategory).forEach(([category, { current, previous }]) => {
      if (previous > 0 && current > 0) {
        const pct = Math.round(((current - previous) / previous) * 100);
        if (Math.abs(pct) >= 10) {
          // only surface meaningful changes (10%+), not noise
          const direction = pct > 0 ? 'increased' : 'decreased';
          insights.push({
            type: pct > 0 ? 'warning' : 'positive',
            text: `Your ${category} spending ${direction} ${Math.abs(pct)}% compared with last month.`,
          });
        }
      } else if (previous === 0 && current > 0) {
        insights.push({
          type: 'info',
          text: `You started spending on ${category} this month (₹${current.toLocaleString('en-IN')}).`,
        });
      }
    });

    // Sort by magnitude of change (biggest surprises first), limit to top 5
    insights.sort((a, b) => {
      const aNum = parseInt(a.text.match(/(\d+)%/)?.[1] || 0);
      const bNum = parseInt(b.text.match(/(\d+)%/)?.[1] || 0);
      return bNum - aNum;
    });

    res.json({ insights: insights.slice(0, 5) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/analytics/trend?months=6
// Monthly totals for the last N months (for line/bar chart in Session 7)
const getTrend = async (req, res) => {
  try {
    const monthsBack = Number(req.query.months) || 6;
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 1);

    const results = await Transaction.aggregate([
      {
        $match: {
          userId: req.user._id,
          type: 'expense',
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$date' }, year: { $year: '$date' } },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const trend = results.map((r) => ({
      month: r._id.month,
      year: r._id.year,
      total: r.total,
    }));

    res.json({ trend });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMonthlySummary, getInsights, getTrend };