import { useState, useRef } from 'react';
import { RiDownload2Line, RiUpload2Line } from 'react-icons/ri';
import api from '../api/axios';

const CsvActions = ({ onImportComplete }) => {
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    const response = await api.get('/transactions/export', { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'spendsense-transactions.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/transactions/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(data.message);
      onImportComplete?.();
    } catch (err) {
      alert(err.response?.data?.message || 'Import failed');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExport}
        className="flex items-center gap-1.5 border border-border hover:border-accent hover:text-accent text-text-muted text-sm font-medium px-3 py-2 rounded-lg transition"
      >
        <RiDownload2Line size={15} /> Export
      </button>
      <button
        onClick={handleImportClick}
        disabled={importing}
        className="flex items-center gap-1.5 border border-border hover:border-accent hover:text-accent text-text-muted text-sm font-medium px-3 py-2 rounded-lg transition disabled:opacity-50"
      >
        <RiUpload2Line size={15} /> {importing ? 'Importing...' : 'Import'}
      </button>
      <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
    </div>
  );
};

export default CsvActions;