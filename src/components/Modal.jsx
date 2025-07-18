import React from 'react';

const escapeHTML = (str) => (str ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);

export default function Modal({ scrap, onClose }) {
    if (!scrap) return null;

    const renderModalContent = () => {
        switch (scrap.type) {
            case 'note': return <p className="text-gray-300 whitespace-pre-wrap text-base">{escapeHTML(scrap.content)}</p>;
            case 'image': return <img src={scrap.imageUrl} alt={scrap.title || 'Scrap Image'} className="w-full h-auto object-contain rounded-lg" />;
            case 'code': return <pre className="bg-gray-900 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto"><code className="font-mono">{escapeHTML(scrap.code)}</code></pre>;
            default: return null;
        }
    };

    const title = scrap.title || scrap.language || scrap.type.charAt(0).toUpperCase() + scrap.type.slice(1);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">{renderModalContent()}</div>
            </div>
        </div>
    );
};
