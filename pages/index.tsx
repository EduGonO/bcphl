import React, { useState } from 'react';
import Papa from 'papaparse';

export default function Home() {
  const [data, setData] = useState<string[][]>([]);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    Papa.parse(file, {
      complete: (results: Papa.ParseResult<string[]>) => {
        setData(results.data);
      }
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>My Movie Data</h1>
      <p>Upload your CSV file to view data:</p>
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
