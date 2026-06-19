import React from 'react';
import { FileText, Download } from 'lucide-react';

/**
 * DocumentsView Component
 * ───────────────────────
 * Renders a list of available documents, certificates, and report cards.
 * Pure component displaying documents list and download trigger buttons.
 *
 * @param {Object} props
 * @param {Array} props.documents - Array of available files.
 */
const DocumentsView = React.memo(({ documents = [] }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <p className="section-title" style={{ fontSize: '1.15rem' }}>Available Documents</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '0.75rem' }}>
        {documents.map((doc, i) => (
          <div key={i} className="card" style={{ padding: '1.125rem', display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* File Icon container */}
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={20} color="#3b82f6" />
            </div>
            
            {/* File Metadata */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {doc.name}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: 2 }}>
                Updated: {doc.updated}
              </div>
            </div>
            
            {/* Download CTA */}
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 0.875rem', background: '#f5f7fa', border: '1px solid #e8e8e8', borderRadius: 10, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, color: '#374151', flexShrink: 0, fontFamily: 'inherit' }}>
              <Download size={14} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

DocumentsView.displayName = 'DocumentsView';

export default DocumentsView;
