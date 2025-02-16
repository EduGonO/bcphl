import React from 'react';

type DebugOverlayProps = {
  layout: 'vertical' | 'horizontal';
  onToggleLayout: () => void;
  bodyFontSize: number;
  onBodyFontSizeChange: (size: number) => void;
  titleFont: 'Gaya' | 'Avenir';
  onTitleFontChange: (font: 'Gaya' | 'Avenir') => void;
  imagePreview: boolean;
  onToggleImagePreview: () => void;
};

const DebugOverlay: React.FC<DebugOverlayProps> = ({
  layout,
  onToggleLayout,
  bodyFontSize,
  onBodyFontSizeChange,
  titleFont,
  onTitleFontChange,
  imagePreview,
  onToggleImagePreview,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        left: 10,
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 2000,
        fontSize: '12px',
      }}
    >
      <div style={{ marginBottom: '5px' }}>
        <button
          onClick={onToggleLayout}
          style={{ padding: '4px 8px', fontSize: '12px' }}
        >
          Switch Layout (Current: {layout})
        </button>
      </div>
      <div style={{ marginBottom: '5px' }}>
        Body Font Size:
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
        Title Font:
        <select
          value={titleFont}
          onChange={(e) => onTitleFontChange(e.target.value as 'Gaya' | 'Avenir')}
          style={{ marginLeft: '5px' }}
        >
          <option value="Gaya">Gaya</option>
          <option value="Avenir">Avenir</option>
        </select>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={imagePreview}
            onChange={onToggleImagePreview}
            style={{ marginRight: '5px' }}
          />
          Show Image Preview
        </label>
      </div>
    </div>
  );
};

export default DebugOverlay;
