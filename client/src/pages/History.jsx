import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TransactionCard from '../components/TransactionCard';
import AddTransactionModal from '../components/AddTransactionModal';
import CsvActions from '../components/CsvActions';
import api from '../api/axios';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const [txRes, catRes] = await Promise.all([
      api.get('/transactions?limit=200'),
      api.get('/categories'),
    ]);
    setTransactions(txRes.data.transactions);
    setCategories(catRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  const handleUpdate = async (id, updatedTx) => {
    const { data } = await api.put(`/transactions/${id}`, updatedTx);
    setTransactions((prev) => prev.map((t) => (t._id === id ? data : t)));
  };

  const categoryMeta = categories.reduce((acc, c) => {
    acc[c.name] = { color: c.color };
    return acc;
  }, {});

  const filtered = transactions.filter((t) =>
    (t.description || t.category).toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg text-text flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold mb-1">History</h1>
            <p className="text-text-muted text-sm">All your transactions, in one place.</p>
          </div>
          <CsvActions onImportComplete={fetchData} />
        </div>

        <input
          type="text"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-surface border border-border text-text placeholder-text-muted px-4 py-2.5 rounded-lg outline-none focus:border-accent mb-6"
        />

        {loading ? (
          <p className="text-text-muted text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-text-muted text-sm">No transactions found.</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((t) => (
              <TransactionCard
                key={t._id}
                transaction={t}
                categoryMeta={categoryMeta}
                onDelete={handleDelete}
                onEdit={setEditingTransaction}
              />
            ))}
          </div>
        )}
      </div>

      {editingTransaction && (
        <AddTransactionModal
          categories={categories}
          editingTransaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default History;
