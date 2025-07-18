import React, { useState } from 'react';
import { supabase, getUserId } from '../services/supabase';

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

  const handleSubmit = async e => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    // build the record
    const record = {
      user_id:     userId,
      type:        scrapType,
      content:     scrapType==='note' ? formData.note : null,
      image_url:   scrapType==='image' ? formData.imageUrl : null,
      image_title: scrapType==='image' ? formData.imageTitle : null,
      url:         scrapType==='link' ? formData.linkUrl : null,
      title:       scrapType==='link' ? formData.linkTitle : null,
      language:    scrapType==='code' ? formData.codeLang : null,
      code:        scrapType==='code' ? formData.codeContent : null,
     
    };

    const { error } = await supabase.from('scraps').insert(record);
    if (error) console.error('Insert failed:', error);

    // reset UI
    setSaving(false);
    setVisible(false);
    setFormData({
      note: '', imageUrl: '', imageTitle: '',
      linkUrl: '', linkTitle: '',
      codeLang: '', codeContent: ''
    });
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-lg shadow mb-8 sticky top-4 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Collection</h2>
        <button
          onClick={() => setVisible(v => !v)}
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >{visible ? 'Cancel' : 'Add New'}</button>
      </div>
      {visible && (
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 mb-4">
            {['note','image','link','code'].map(t =>
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded text-sm ${
                  scrapType===t
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-300'}`}
              >{t.charAt(0).toUpperCase()+t.slice(1)}</button>
            )}
          </div>
          {/* render fields */}
          {scrapType==='note' && (
            <textarea
              name="note" value={formData.note}
              onChange={handleChange}
              className="w-full bg-gray-700 p-2 rounded mb-2"
              placeholder="Your note…"
            />
          )}
          {scrapType==='image' && <>
            <input
              name="imageUrl" value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Image URL"
              className="w-full bg-gray-700 p-2 rounded mb-2"
            />
            <input
              name="imageTitle" value={formData.imageTitle}
              onChange={handleChange}
              placeholder="Image title (optional)"
              className="w-full bg-gray-700 p-2 rounded mb-2"
            />
          </>}
          {scrapType==='link' && <>
            <input
              name="linkUrl" value={formData.linkUrl}
              onChange={handleChange}
              placeholder="Link URL"
              className="w-full bg-gray-700 p-2 rounded mb-2"
            />
            <input
              name="linkTitle" value={formData.linkTitle}
              onChange={handleChange}
              placeholder="Link title (optional)"
              className="w-full bg-gray-700 p-2 rounded mb-2"
            />
          </>}
          {scrapType==='code' && <>
            <input
              name="codeLang" value={formData.codeLang}
              onChange={handleChange}
              placeholder="Language"
              className="w-full bg-gray-700 p-2 rounded mb-2"
            />
            <textarea
              name="codeContent" value={formData.codeContent}
              onChange={handleChange}
              className="w-full bg-gray-700 p-2 rounded mb-2 font-mono text-sm"
              placeholder="Your code…"
            />
          </>}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-emerald-600 py-2 rounded text-white"
          >
            {saving ? 'Saving…' : 'Save Curation'}
          </button>
        </form>
      )}
    </div>
  );
}
