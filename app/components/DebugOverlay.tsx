import React from 'react';

type DebugOverlayProps = {
  layout: 'vertical' | 'horizontal';
  onToggleLayout: () => void;
  bodyFontSize: number;
  onBodyFontSizeChange: (size: number) => void;
  bodyFont: 'InterRegular' | 'AvenirNextCondensed';
  onBodyFontChange: (font: 'InterRegular' | 'AvenirNextCondensed') => void;
  titleFont: 'RecoletaMedium' | 'GayaRegular';
  onTitleFontChange: (font: 'RecoletaMedium' | 'GayaRegular') => void;
  imagePreview: boolean;
  onToggleImagePreview: () => void;
  articleSidebar: boolean;
  onToggleArticleSidebar: () => void;
};

const DebugOverlay: React.FC<DebugOverlayProps> = ({
  layout,
  onToggleLayout,
  bodyFontSize,
  onBodyFontSizeChange,
  bodyFont,
  onBodyFontChange,
  titleFont,
  onTitleFontChange,
  imagePreview,
  onToggleImagePreview,
  articleSidebar,
  onToggleArticleSidebar,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        left: 10,
        background: 'rgba(0,0,0,0.42)',
        color: '#fff',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 2000,
        fontSize: '12px',
      }}
    >
      <div style={{ marginBottom: '5px' }}>
        <button onClick={onToggleLayout} style={{ padding: '4px 8px', fontSize: '12px' }}>
          navigation: {layout}
        </button>
      </div>
      <div style={{ marginBottom: '5px' }}>
        font(tout):
        <input
          type="range"
          min="16"
          max="24"
          value={bodyFontSize}
          onChange={(e) => onBodyFontSizeChange(Number(e.target.value))}
          style={{ marginLeft: '5px' }}
        />
        <span style={{ marginLeft: '5px' }}>{bodyFontSize}px</span>
      </div>
      <div style={{ marginBottom: '5px' }}>
        font(titre):
        <select
          value={titleFont}
          onChange={(e) =>
            onTitleFontChange(e.target.value as 'RecoletaMedium' | 'GayaRegular')
          }
          style={{ marginLeft: '5px' }}
        >
          <option value="RecoletaMedium">Recoleta Medium</option>
          <option value="GayaRegular">Gaya</option>
        </select>
      </div>
      <div style={{ marginBottom: '5px' }}>
        <label style={{ marginRight: '5px' }}>Body Font:</label>
        <select
          value={bodyFont}
          onChange={(e) =>
            onBodyFontChange(e.target.value as 'InterRegular' | 'AvenirNextCondensed')
          }
        >
          <option value="InterRegular">Inter Regular</option>
          <option value="AvenirNextCondensed">AvenirNextCondensed</option>
        </select>
      </div>
      <div style={{ marginBottom: '5px' }}>
        <label>
          <input
            type="checkbox"
            checked={imagePreview}
            onChange={onToggleImagePreview}
            style={{ marginRight: '5px' }}
          />
          Image Article
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={articleSidebar}
            onChange={onToggleArticleSidebar}
            style={{ marginRight: '5px' }}
          />
          Info Article
        </label>
      </div>
    </div>
  );
};

export default DebugOverlay;
