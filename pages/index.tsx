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
        console.log('CSV missing required headers. Must have Name, Year, Rating.');
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
      
      const apiKey = process.env.TMDB_API_KEY;
      if (!apiKey) {
        console.log('Missing TMDB API key.');
        return;
      }

      const results = await Promise.all(films.map(async (film) => {
        const query = encodeURIComponent(film.name);
        const year = encodeURIComponent(film.year);
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&year=${year}`;
        try {
          const res = await fetch(url);
          if (!res.ok) {
            console.log('TMDb fetch failed:', res.statusText);
            return film;
          }
          const json = await res.json();
          const movie = json.results && json.results.length > 0 ? json.results[0] : null;
          return {
            ...film,
            posterPath: movie ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
            overview: movie?.overview
          };
        } catch (err) {
          console.log('Error fetching TMDb data:', err);
          return film;
        }
      }));
      console.log('Display films:', results);
      setDisplayFilms(results);
    };
    fetchFilmData();
  }, [films]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>My Top Films</h1>
      <p>Upload CSV (with Name, Year, Rating):</p>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {displayFilms.length > 0 ? (
        <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0 }}>
          {displayFilms.map((f, i) => (
            <li key={i} style={{ marginBottom: '20px' }}>
              <strong>{f.name}, {f.year} - {f.rating}</strong><br />
              {f.posterPath && <img src={f.posterPath} alt={f.name} style={{ width: '100px', display: 'block', marginTop: '10px' }} />}
              {f.overview && <p style={{ maxWidth: '400px' }}>{f.overview}</p>}
            </li>
          ))}
        </ul>
      ) : (
        films.length > 0 ? <p>No matches found in TMDb.</p> : <p>Upload a file with some 5-star films to see results.</p>
      )}
    </div>
  );
}
