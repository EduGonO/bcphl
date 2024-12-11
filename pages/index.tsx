import React, { useState, useEffect } from 'react';

type FilmData = {
  name: string;
  year: string;
  rating: string;
};

type FilmDisplayData = {
  name: string;
  year: string;
  rating: string;
  posterPath?: string;
  overview?: string;
};

export default function Home() {
  const [films, setFilms] = useState<FilmData[]>([]);
  const [displayFilms, setDisplayFilms] = useState<FilmDisplayData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = (reader.result as string).trim();
      if (!text) {
        console.log('No file content.');
        return;
      }
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      const data = lines.map(line => line.split(',').map(cell => cell.trim()));
      const headers = data[0];
      const nameIndex = headers.indexOf('Name');
      const yearIndex = headers.indexOf('Year');
      const ratingIndex = headers.indexOf('Rating');

      if (nameIndex === -1 || yearIndex === -1 || ratingIndex === -1) {
        console.log('CSV missing required headers: Name, Year, Rating.');
        return;
      }

      const allFilms = data.slice(1).map(row => ({
        name: row[nameIndex],
        year: row[yearIndex],
        rating: row[ratingIndex]
      }));

      const bestFilms = allFilms.filter(f => f.rating === '5');
      console.log('Best films:', bestFilms);
      setFilms(bestFilms);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const fetchFilmData = async () => {
      if (films.length === 0) {
        setDisplayFilms([]);
        return;
      }
      
      const bearerToken = process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN;
      if (!bearerToken) {
        console.log('Missing TMDB Bearer token.');
        return;
      }

      setLoading(true);
      const results = await Promise.all(films.map(async (film) => {
        const query = encodeURIComponent(film.name);
        const url = `https://api.themoviedb.org/3/search/movie?query=${query}`;
        try {
          const res = await fetch(url, {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${bearerToken}`
            }
          });
          if (!res.ok) {
            console.log('TMDb fetch failed:', res.statusText);
            return film;
          }
          const json = await res.json();
          console.log('TMDb search result for', film.name, json);
          const movie = json.results && json.results.length > 0 ? json.results[0] : null;
          return {
            ...film,
            posterPath: movie && movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
            overview: movie?.overview
          };
        } catch (err) {
          console.log('Error fetching TMDb data:', err);
          return film;
        }
      }));
      setDisplayFilms(results);
      setLoading(false);
    };
    fetchFilmData();
  }, [films]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>My Top Films</h1>
      <p>Upload CSV (with Name, Year, Rating):</p>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      {loading && <p>Loading film data...</p>}

      {!loading && displayFilms.length > 0 && (
        <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0 }}>
          {displayFilms.map((f, i) => (
            <li key={i} style={{ marginBottom: '20px' }}>
              <strong>{f.name}, {f.year} - {f.rating}</strong><br />
              {f.posterPath && (
                <img 
                  src={f.posterPath} 
                  alt={f.name} 
                  style={{ width: '100px', display: 'block', marginTop: '10px' }} 
                />
              )}
              {f.overview && <p style={{ maxWidth: '400px' }}>{f.overview}</p>}
            </li>
          ))}
        </ul>
      )}

      {!loading && films.length > 0 && displayFilms.every(f => !f.posterPath && !f.overview) && (
        <p>No matches found in TMDb or no posters available.</p>
      )}

      {!loading && films.length === 0 && (
        <p>Upload a file with some 5-star films to see results.</p>
      )}
    </div>
  );
}
