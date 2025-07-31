// src/components/CurationCard.jsx
import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CurationCard({
  scrap,
  onCardClick = () => {},        // default no-op
  onDeleteClick = () => {},      // default no-op
}) {
  const timestamp = scrap.created_at
    ? new Date(scrap.created_at).toLocaleString()
    : 'Just now';

  const [imgError, setImgError] = useState(false);
  const [linkImgError, setLinkImgError] = useState(false);

  useEffect(() => { setImgError(false); }, [scrap.image_url]);
  useEffect(() => { setLinkImgError(false); }, [scrap.url, scrap.preview_image]);
  useEffect(() => {
    if (scrap.embed_html && window.twttr?.widgets) {
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

  // clamp to 3 lines
  const noteStyle = {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const renderContent = () => {
    switch (scrap.type) {
      case 'note':
        return (
          <div className="p-5 flex-grow">
            <p style={noteStyle} className="text-gray-800">
              {scrap.content}
            </p>
          </div>
        );

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
              <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                <span className="text-gray-500">Image not available</span>
              </div>
            )}
            {scrap.title && !imgError && (
              <p className="text-gray-800 mt-2 truncate">
                {scrap.title}
              </p>
            )}
          </div>
        );

      case 'link': {
        const attemptDirectImage = !scrap.embed_html && !scrap.cfTitle;
        return (
          <div className="p-5 flex-grow">
            <h3 className="font-bold mb-2 truncate text-gray-800">
              {scrap.title || scrap.url}
            </h3>

            {attemptDirectImage && !linkImgError && (
              <SafeImg
                src={scrap.url}
                alt={scrap.title || 'Image'}
                className="w-full h-32 object-cover rounded-lg"
                setError={setLinkImgError}
              />
            )}

            {linkImgError && scrap.embed_html && (
              <div
                className="twitter-tweet-container"
                dangerouslySetInnerHTML={{ __html: scrap.embed_html }}
              />
            )}

            {linkImgError && !scrap.embed_html && scrap.cfTitle && (
              <div className="bg-gray-100 p-4 rounded">
                <h4 className="text-gray-800 font-semibold">
                  {scrap.cfTitle} ({scrap.cfRating})
                </h4>
                <p className="text-gray-600 text-sm mt-1">
                  Tags: {scrap.cfTags.join(', ')}
                </p>
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
              <a
                href={scrap.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate block"
              >
                {scrap.url}
              </a>
            )}
          </div>
        );
      }

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

  const clickable = scrap.type !== 'link';

  return (
    <div
      className="
        scrap-card
        bg-white
        rounded-xl
        shadow-md
        flex flex-col
        overflow-hidden
        border border-gray-200
        hover:border-blue-500
        transition
        cursor-pointer
      "
      onClick={() => clickable && onCardClick(scrap)}
    >
      <div className="flex flex-col flex-grow min-h-0">
        {renderContent()}
      </div>
      <div className="bg-white p-3 flex justify-between items-center border-t border-gray-200">
        <span className="text-xs text-gray-500">{timestamp}</span>
        <button
          type="button"                     // ← ensure it’s not a submit
          onClick={e => {
            e.stopPropagation();            // prevent card click
            console.log('Deleting:', scrap.id);
            onDeleteClick(scrap.id);
          }}
          className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-red-100 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
