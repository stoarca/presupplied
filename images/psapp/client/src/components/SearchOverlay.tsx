import React from 'react';
import {TechTree} from '../dependency-graph';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  cell: { i: number; j: number };
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (result: SearchResult) => void;
  knowledgeGraph: TechTree;
}

export const SearchOverlay = ({ isOpen, onClose, onSelect, knowledgeGraph }: SearchOverlayProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const searchResults = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return [];
    }

    const normalizeText = (text: string) => text.toLowerCase().replace(/[_\s]+/g, ' ');
    const searchWords = normalizeText(searchTerm).split(' ').filter(word => word.length > 0);
    const results: SearchResult[] = [];
    const allNodes = knowledgeGraph.overallOrder();

    for (const nodeId of allNodes) {
      const nodeData = knowledgeGraph.getNodeData(nodeId);
      const searchableText = normalizeText([
        nodeData.id,
        nodeData.title || '',
        nodeData.description || ''
      ].join(' '));

      const matchesAllWords = searchWords.every(word => searchableText.includes(word));
      if (matchesAllWords) {
        results.push({
          id: nodeData.id,
          title: nodeData.title || nodeData.id,
          description: nodeData.description || '',
          cell: nodeData.cell
        });
      }
    }

    return results.slice(0, 20);
  }, [searchTerm, knowledgeGraph]);

  React.useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [isOpen]);

  React.useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && searchResults[selectedIndex]) {
      onSelect(searchResults[selectedIndex]);
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '100px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          width: '600px',
          maxHeight: '400px',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search modules by ID, title, or description..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>
        {searchResults.length > 0 && (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {searchResults.map((result, index) => (
              <div
                key={result.id}
                style={{
                  padding: '12px 16px',
                  borderBottom: index < searchResults.length - 1 ? '1px solid #f0f0f0' : 'none',
                  backgroundColor: index === selectedIndex ? '#f5f5f5' : 'white',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  onSelect(result);
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                  {result.title}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>
                  ID: {result.id}
                </div>
                {result.description && (
                  <div style={{ fontSize: '12px', color: '#888' }}>
                    {result.description.length > 100
                      ? result.description.substring(0, 100) + '...'
                      : result.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {searchTerm.trim() && searchResults.length === 0 && (
          <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>
            No results found
          </div>
        )}
        <div style={{ padding: '8px 16px', fontSize: '12px', color: '#999', borderTop: '1px solid #f0f0f0' }}>
          Press <kbd style={{ padding: '2px 4px', backgroundColor: '#f5f5f5', borderRadius: '2px' }}>↑↓</kbd> to navigate, <kbd style={{ padding: '2px 4px', backgroundColor: '#f5f5f5', borderRadius: '2px' }}>Enter</kbd> to select, <kbd style={{ padding: '2px 4px', backgroundColor: '#f5f5f5', borderRadius: '2px' }}>Esc</kbd> to close
        </div>
      </div>
    </div>
  );
};