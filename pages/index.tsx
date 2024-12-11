import React, { useState } from 'react';

export default function Home() {
  const [data, setData] = useState<string[][]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      const parsed = lines.map(line => line.split(','));
      setData(parsed);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>My Movie Data</h1>
      <p>Upload your CSV file:</p>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {data.length > 0 && (
        <table style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {data[0].map((col, i) => (
                <th key={i} style={{ border: '1px solid #ccc', padding: '5px' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} style={{ border: '1px solid #ccc', padding: '5px' }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
