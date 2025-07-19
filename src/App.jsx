import React, { useState } from 'react';
import useScraps from './hooks/useScraps';
import AddCurationForm from './components/AddCurationForm';
import CurationCard from './components/CurationCard';
import Modal from './components/Modal';

export default function App() {
  const { scraps, loading: dataLoading, remove } = useScraps();
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState('');

  const visible = scraps.filter(s =>
    (s.title || s.content || '').toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-gray-900 min-h-screen p-4">
      {/* ------------------ Header ------------------ */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Curations</h1>
          <p className="text-gray-400">Save anything, anywhere.</p>
        </div>
        <input
          type="text"
          placeholder="Search…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded w-full sm:w-60"
        />
      </header>

      {/* ------------------ Add Form ------------------ */}
      <AddCurationForm />

      {/* ------------------ Scrap List ------------------ */}
      {dataLoading ? (
        <p className="text-gray-400">Loading scraps…</p>
      ) : visible.length === 0 ? (
        <p className="text-gray-400">No results.</p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {visible.map(scrap => (
            <CurationCard
              key={scrap.id}
              scrap={scrap}
              onCardClick={setModal}
              onDeleteClick={remove}
            />
          ))}
        </div>
      )}

      {/* ------------------ Modal ------------------ */}
      <Modal scrap={modal} onClose={() => setModal(null)} />
    </div>
  );
}
