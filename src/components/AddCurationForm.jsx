
import React, { useState } from 'react';
import { supabase, getUserId } from '../services/supabase';

const TABS = ['note', 'image', 'link', 'code'];

export default function AddCurationForm() {
  const [visible, setVisible]   = useState(false);
  const [scrapType, setType]    = useState('note');
  const [formData, setFormData] = useState({
    note: '', imageUrl: '', imageTitle: '',
    linkUrl: '', linkTitle: '',
    codeLang: '', codeContent: ''
  });
  const [saving, setSaving]     = useState(false);
  const userId = getUserId();

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const reset = () => {
    setFormData({
      note: '', imageUrl: '', imageTitle: '',
      linkUrl: '', linkTitle: '',
      codeLang: '', codeContent: ''
    });
    setType('note');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    const record = {
      user_id:     userId,
      type:        scrapType,
      content:     scrapType === 'note'  ? formData.note.trim() : null,
      image_url:   scrapType === 'image' ? formData.imageUrl.trim()   : null,
      image_title: scrapType === 'image' ? formData.imageTitle.trim() : null,
      url:         scrapType === 'link'  ? formData.linkUrl.trim()    : null,
      title:       scrapType === 'link'  ? formData.linkTitle.trim()  : null,
      language:    scrapType === 'code'  ? formData.codeLang.trim()   : null,
      code:        scrapType === 'code'  ? formData.codeContent       : null,
    };

    const { data, error } = await supabase
      .from('scraps')
      .insert(record);

    if (error) {
      console.error('Insert failed:', error);
    } else {
      reset();
      setVisible(false);
    }

    setSaving(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow mb-8 sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">My Collection</h2>
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700 transition"
        >
          {visible ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {visible && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tab selectors */}
          <div className="flex gap-2">
            {TABS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  scrapType === t
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Dynamic fields */}
          {scrapType === 'note' && (
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Your note…"
              rows={4}
              className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
            />
          )}

          {scrapType === 'image' && (
            <>
              <input
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Image URL"
                className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              />
              <input
                name="imageTitle"
                value={formData.imageTitle}
                onChange={handleChange}
                placeholder="Image title (optional)"
                className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              />
            </>
          )}

          {scrapType === 'link' && (
            <>
              <input
                name="linkUrl"
                value={formData.linkUrl}
                onChange={handleChange}
                placeholder="Link URL"
                className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              />
              <input
                name="linkTitle"
                value={formData.linkTitle}
                onChange={handleChange}
                placeholder="Link title (optional)"
                className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              />
            </>
          )}

          {scrapType === 'code' && (
            <>
              <input
                name="codeLang"
                value={formData.codeLang}
                onChange={handleChange}
                placeholder="Language (e.g. javascript)"
                className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              />
              <textarea
                name="codeContent"
                value={formData.codeContent}
                onChange={handleChange}
                rows={4}
                placeholder="Your code…"
                className="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono text-sm text-gray-900"
              />
            </>
          )}

          {/* Save button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2 rounded transition"
          >
            {saving ? 'Saving…' : 'Save Curation'}
          </button>
        </form>
      )}
    </div>
  );
}
