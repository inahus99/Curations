import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

// The main Modal component
export default function Modal({ scrap, onClose }) {
  if (!scrap) return null;

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const title =
    (scrap && scrap.title) ||
    (scrap.type === 'code' ? scrap.language : undefined) ||
    scrap.type.charAt(0).toUpperCase() + scrap.type.slice(1);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/*  white card  */}
        <div className="bg-white text-gray-900 rounded-2xl border border-gray-200 shadow-lg">
          {/* header */}
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold truncate">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* body — each block has its own container */}
          <div className="p-6 overflow-y-auto">
            {scrap.type === 'note' && <NoteContent text={scrap.content} />}
            {scrap.type === 'code' && <CodeContent code={scrap.code} language={scrap.language} />}
            {scrap.type === 'image' && <ImageContent src={scrap.image_url || scrap.imageUrl} alt={title || 'Image'} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------- independent containers --------------------

function NoteContent({ text }) {
  const LINES = 10;
  const LINE_PX = 28;

  const [expanded, setExpanded] = useState(false);
  const [overflow, setOverflow] = useState(false);
  const [maxHeight, setMaxHeight] = useState(`${LINES * LINE_PX}px`);
  const pId = React.useId();

  useEffect(() => {
    setExpanded(false);
  }, [text]);

  useEffect(() => {
    const el = document.getElementById(pId);
    if (!el) return;
    const prev = el.style.maxHeight;
    el.style.maxHeight = 'none';
    const full = el.scrollHeight;
    const clampH = LINES * LINE_PX;
    setOverflow(full > clampH + 1);
    el.style.maxHeight = expanded ? 'none' : `${clampH}px`;
    setMaxHeight(expanded ? 'none' : `${clampH}px`);
    return () => { el.style.maxHeight = prev; };
  }, [text, expanded, pId]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="relative">
        <p
          id={pId}
          className="text-[15px] leading-7 text-gray-800 whitespace-pre-wrap break-words"
          style={{ maxHeight, overflow: 'hidden' }}
        >
          {text}
        </p>
        {!expanded && overflow && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>

      {overflow && (
        <button
          className="mt-3 text-sm text-blue-600 hover:underline"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}

/* Code content with truncation and syntax highlighting */
function CodeContent({ code, language }) {
  const [expanded, setExpanded] = useState(false);
  const LINES = 15; // Set a line limit for truncation
  const codeLines = code.split('\n');
  const shouldTruncate = codeLines.length > LINES;
  const displayedCode = expanded ? code : codeLines.slice(0, LINES).join('\n');

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="bg-[#111214] text-white text-[13px] leading-6 rounded-2xl m-0 overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={dracula}
          showLineNumbers
          customStyle={{
            maxHeight: expanded ? '65vh' : `${LINES * 24}px`, // Adjust max height based on expansion
            overflowY: expanded ? 'auto' : 'hidden',
            padding: '1rem',
            backgroundColor: 'transparent',
            margin: 0,
          }}
        >
          {displayedCode}
        </SyntaxHighlighter>
      </div>
      {shouldTruncate && (
        <button
          className="w-full mt-2 py-2 text-sm text-blue-600 hover:bg-gray-100 transition rounded-b-2xl"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
}

/*  in-modal image preview */
function ImageContent({ src, alt }) {
  const [broken, setBroken] = useState(false);
  const url = src;

  if (!url) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
        No image URL provided.
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
      style={{ minHeight: 260, maxHeight: '65vh' }}
    >
      {!broken ? (
        <img
          key={url}
          src={url}
          alt={alt}
          className="block w-full h-full object-contain mx-auto select-none"
          onError={() => setBroken(true)}
          draggable={false}
          style={{ maxHeight: '60vh' }}
        />
      ) : (
        <div className="flex items-center justify-center h-[260px] text-sm text-gray-500">
          Image failed to load
        </div>
      )}
    </div>
  );
}