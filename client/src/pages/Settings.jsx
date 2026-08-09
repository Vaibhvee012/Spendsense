import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import BudgetManager from '../components/BudgetManager';
import AddCategoryModal from '../components/AddCategoryModal';
import api from '../api/axios';

const Settings = () => {
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBudgetManager, setShowBudgetManager] = useState(false);

  const fetchCategories = async () => {
    const { data } = await api.get('/categories');
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (newCat) => {
    const { data } = await api.post('/categories', newCat);
    setCategories((prev) => [...prev, data]);
  };

  return (
    <div className="min-h-screen bg-bg text-text flex">
      <Sidebar />
      <div className="flex-1 p-8 max-w-2xl">
        <h1 className="font-display text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-text-muted text-sm mb-8">Manage your categories and monthly budgets.</p>

        <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display font-semibold text-text">Categories</h2>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="bg-accent hover:brightness-110 text-bg text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              + New Category
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <div key={c._id} className="flex items-center gap-2 bg-surface-light border border-border rounded-lg px-3 py-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-text text-sm">{c.name}</span>
                <span className="text-text-muted text-xs ml-auto capitalize">{c.type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-display font-semibold text-text mb-1">Monthly Budgets</h2>
              <p className="text-text-muted text-sm">Set spending limits for this month.</p>
            </div>
            <button
              onClick={() => setShowBudgetManager(true)}
              className="border border-border hover:border-accent hover:text-accent text-text-muted text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      {showCategoryModal && (
        <AddCategoryModal onClose={() => setShowCategoryModal(false)} onAdd={handleAddCategory} />
      )}
      {showBudgetManager && (
        <BudgetManager categories={categories} onClose={() => setShowBudgetManager(false)} />
      )}
    </div>
  );
};

export default Settings;
