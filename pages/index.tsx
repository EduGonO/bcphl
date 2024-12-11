import React, { useState } from 'react';

export default function Home() {
  const [films, setFilms] = useState<{name:string;year:string;rating:string}[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      const data = lines.map(line => line.split(','));
      const headers = data[0];
      const nameIndex = headers.indexOf('Name');
      const yearIndex = headers.indexOf('Year');
      const ratingIndex = headers.indexOf('Rating');
      
      const allFilms = data.slice(1).map(row => ({
        name: row[nameIndex],
        year: row[yearIndex],
        rating: row[ratingIndex]
      }));
      const bestFilms = allFilms.filter(f => f.rating === '5');
      setFilms(bestFilms);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>My Top Films</h1>
      <p>Upload CSV:</p>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {films.length > 0 && (
        <ul style={{ marginTop: '20px' }}>
          {films.map((f, i) => (
            <li key={i}>{f.name}, {f.year} - {f.rating}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
