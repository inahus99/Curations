
import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CurationCard({ scrap, onCardClick, onDeleteClick }) {
  const timestamp = scrap.created_at
    ? new Date(scrap.created_at).toLocaleString()
    : 'Just now';

  const [imgError, setImgError] = useState(false);
  const [linkImgError, setLinkImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [scrap.image_url]);
  useEffect(() => { setLinkImgError(false); }, [scrap.url, scrap.preview_image]);

  useEffect(() => {
    if (scrap.embed_html && window.twttr && window.twttr.widgets) {
      window.twttr.widgets.load();
    }
  }, [scrap.embed_html]);
  const SafeImg = ({ src, alt, className, setError }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      onLoad={() => setError(false)}
    />
  );

  /* ---------------------------- RENDER SWITCH -------------------*/
  const renderContent = () => {
    switch (scrap.type) {
      /* --------------------------- NOTE --------------------------*/
      case 'note':
        return (
          <div className="p-5 flex-grow">
            <p className="text-gray-300 whitespace-pre-wrap">{scrap.content}</p>
          </div>
        );

      /* -------------------------- IMAGE -------------------------*/
      case 'image':
        return (
          <div className="p-5 flex-grow">
            {!imgError ? (
              <SafeImg
                src={scrap.image_url}
                alt={scrap.title || 'Image'}
                className="w-full h-48 object-cover rounded-lg"
                setError={setImgError}
              />
            ) : (
              <div className="w-full h-48 flex items-center justify-center bg-gray-700 rounded-lg">
                <span className="text-gray-400">Image not available</span>
              </div>
            )}
            {scrap.title && !imgError && (
              <p className="text-gray-300 mt-2 truncate">{scrap.title}</p>
            )}
          </div>
        );

      /* --------------------------- LINK --------------------------*/
      case 'link': {

        const attemptDirectImage = !scrap.embed_html && !scrap.cfTitle;
        return (
          <div className="p-5 flex-grow">
            <h3 className="font-bold mb-2 truncate">{scrap.title || scrap.url}</h3>

            {attemptDirectImage && !linkImgError && (
              <SafeImg
                src={scrap.url}
                alt={scrap.title || 'Image'}
                className="w-full h-32 object-cover rounded-lg"
                setError={setLinkImgError}
              />
            )}

            {linkImgError && scrap.embed_html && (
              <div className="twitter-tweet-container" dangerouslySetInnerHTML={{ __html: scrap.embed_html }} />
            )}

            {linkImgError && !scrap.embed_html && scrap.cfTitle && (
              <div className="bg-gray-700 p-4 rounded">
                <h4 className="text-white font-semibold">{scrap.cfTitle} ({scrap.cfRating})</h4>
                <p className="text-gray-400 text-sm mt-1">Tags: {scrap.cfTags.join(', ')}</p>
              </div>
            )}

            {linkImgError && !scrap.embed_html && !scrap.cfTitle && scrap.preview_image && (
              <SafeImg
                src={scrap.preview_image}
                alt={scrap.title || scrap.url}
                className="w-full h-32 object-cover rounded-lg"
                setError={setLinkImgError}
              />
            )}

            {linkImgError && !scrap.embed_html && !scrap.cfTitle && !scrap.preview_image && (
              <a href={scrap.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate block">
                {scrap.url}
              </a>
            )}
          </div>
        );
      }

      /* --------------------------- CODE --------------------------*/
      case 'code':
        return (
          <div className="p-5 flex-grow overflow-auto">
            <SyntaxHighlighter
              language={scrap.language || 'text'}
              style={tomorrow}
              className="rounded-lg"
            >
              {scrap.code}
            </SyntaxHighlighter>
          </div>
        );

      default:
        return null;
    }
  };

  /* ----------------------- CARD WRAPPER ------------------------*/
  const clickable = scrap.type !== 'link';
  return (
    <div
      className="scrap-card bg-gray-800 rounded-xl shadow-md flex flex-col overflow-hidden border border-gray-700 hover:border-blue-500 transition cursor-pointer"
      onClick={() => clickable && onCardClick(scrap)}
    >
      <div className="flex flex-col flex-grow min-h-0">{renderContent()}</div>
      <div className="bg-gray-800/50 p-3 flex justify-between items-center border-t border-gray-700/50">
        <span className="text-xs text-gray-500">{timestamp}</span>
        <button
          onClick={e => { e.stopPropagation(); onDeleteClick(scrap.id); }}
          className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-red-500/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
