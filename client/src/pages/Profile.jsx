import { useState } from 'react';
import { motion } from 'framer-motion';
import { RiPencilLine, RiCameraLine, RiCheckLine, RiCloseLine } from 'react-icons/ri';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [preview, setPreview] = useState(user?.profilePicture || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setError('Image must be under 1MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      const { data } = await api.put('/auth/profile', { name, email, profilePicture: preview });
      updateUser(data);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPreview(user?.profilePicture || '');
    setError('');
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-bg text-text flex">
      <Sidebar />
      <div className="flex-1 p-8 max-w-lg">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold mb-1">Profile</h1>
            <p className="text-text-muted text-sm">Your account details.</p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 border border-border hover:border-accent hover:text-accent text-text-muted text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              <RiPencilLine size={15} /> Edit
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-5 mb-6">
            <div className="relative">
              {preview ? (
                <img src={preview} alt="Profile" className="w-20 h-20 rounded-full object-cover border border-border" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-accent-2/20 flex items-center justify-center text-accent-2 font-semibold font-display text-2xl">
                  {name?.[0]?.toUpperCase()}
                </div>
              )}
              {editing && (
                <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-accent rounded-full flex items-center justify-center cursor-pointer border-2 border-surface">
                  <RiCameraLine size={14} className="text-bg" />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
            {!editing && (
              <div>
                <p className="text-text font-display font-semibold text-lg">{user?.name}</p>
                <p className="text-text-muted text-sm">{user?.email}</p>
              </div>
            )}
          </div>

          {editing && (
            <div className="space-y-4">
              <div>
                <label className="text-text-muted text-xs font-medium mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-light border border-border text-text px-4 py-2.5 rounded-lg outline-none focus:border-accent transition"
                />
              </div>
              <div>
                <label className="text-text-muted text-xs font-medium mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-light border border-border text-text px-4 py-2.5 rounded-lg outline-none focus:border-accent transition"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 bg-accent hover:brightness-110 text-bg text-sm font-semibold px-4 py-2 rounded-lg transition disabled:opacity-60"
                >
                  <RiCheckLine size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1.5 border border-border text-text-muted hover:text-text text-sm font-medium px-4 py-2 rounded-lg transition"
                >
                  <RiCloseLine size={16} /> Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;