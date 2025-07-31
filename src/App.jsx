
import React, { useState } from 'react';
import AddCurationForm from './components/AddCurationForm';
import CurationCard from './components/CurationCard';
import Modal from './components/Modal';
import useScraps from './hooks/useScraps';
import './styles/main.css';

export default function App() {
  const { scraps, addScrap, deleteScrap } = useScraps();
  const [selectedScrap, setSelectedScrap] = useState(null);

  const handleCardClick = (scrap) => {
    setSelectedScrap(scrap);
  };

  const handleDeleteClick = (id) => {
 
    deleteScrap(id);
  };

  const handleCloseModal = () => {
    setSelectedScrap(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold"> Curations. </h1>
          <p className="mt-2 text-gray-500">
            Save your notes, images, links &amp; code snippets.
          </p>
        </header>

        {/* Add new scrap form */}
        <section className="mb-10">
          <AddCurationForm onAdd={addScrap} />
        </section>

        {/* Grid of cards */}
        <section>
          {scraps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {scraps.map((scrap) => (
                <CurationCard
                  key={scrap.id}
                  scrap={scrap}
                  onCardClick={handleCardClick}
                  onDeleteClick={handleDeleteClick}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No scraps yet. Add one above!</p>
          )}
        </section>
      </div>

      {/* Modal for viewing a scrap  */}
      {selectedScrap && (
        <Modal scrap={selectedScrap} onClose={handleCloseModal} />
      )}
    </div>
  );
}
