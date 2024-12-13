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
  x: number;
  y: number;
};

type TMDBMovie = {
  title: string;
  release_date: string;
  poster_path?: string;
  overview?: string;
};

type TMDBResponse = {
  results: TMDBMovie[];
};







const TMDB_API_KEY = 'af88d6dada5f10dd6fbc046537d3d6ce'; // Replace with actual key

export const fetchMovie = async (query: string, year?: string) => {
  const url = year
    ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&year=${year}`
    : `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZjg4ZDZkYWRhNWYxMGRkNmZiYzA0NjUzN2QzZDZjZSIsIm5iZiI6MTU4NzM0NzE1NC4xMjksInN1YiI6IjVlOWNmZWQyYTUwNDZlMDAxZjk5ZDE3MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hGgzgFEPIVIrbQ7DbMLNq5ll6RtjHQsvR4tJNJJarlc', // Replace with your Bearer token
      },
    });

    if (!res.ok) {
      console.error(`TMDB fetch failed: ${res.status} - ${res.statusText}`);
      throw new Error(`TMDB fetch failed: ${res.status} - ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error in fetchMovie:', error);
    throw error;
  }
};








const classifyFilm = (film: string): { x: number; y: number } => {
  // Basic classification logic based on keywords
  const lowerName = film.toLowerCase();

  const x = lowerName.includes('inception') || lowerName.includes('memento')
    ? 0.3 // Non-linear
    : lowerName.includes('transformers') || lowerName.includes('marvel')
    ? 0.8 // Linear
    : 0.5; // Neutral

  const y = lowerName.includes('kubrick') || lowerName.includes('bergman')
    ? 0.8 // Artistic
    : lowerName.includes('blockbuster') || lowerName.includes('disney')
    ? 0.2 // Commercial
    : 0.5; // Neutral

  return { x, y };
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
        rating: row[ratingIndex],
      }));

      const bestFilms = allFilms.filter(f => f.rating === '5');
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

      setLoading(true);
      const results = await Promise.all(
        films.map(async (film) => {
          try {
            const data = await fetchMovie(film.name, film.year);
            const movie = data.results?.[0];
            const { x, y } = classifyFilm(film.name);

            return {
              ...film,
              posterPath: movie?.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : undefined,
              overview: movie?.overview,
              x,
              y,
            };
          } catch (error) {
            return {
              ...film,
              x: 0.5,
              y: 0.5,
            };
          }
        })
      );

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

      {!loading && (
        <div style={{ position: 'relative', width: '500px', height: '500px', border: '1px solid #ccc', margin: '20px auto' }}>
          {displayFilms.map((film, i) => (
            <div
              key={i}
              title={`${film.name} (${film.year})`}
              style={{
                position: 'absolute',
                left: `${film.x * 100}%`,
                bottom: `${film.y * 100}%`,
                transform: 'translate(-50%, 50%)',
                width: '50px',
                height: '75px',
                backgroundImage: `url(${film.posterPath})`,
                backgroundSize: 'cover',
                border: '1px solid #000',
              }}
            ></div>
          ))}
        </div>
      )}

      {!loading && films.length > 0 && displayFilms.every(f => !f.posterPath) && (
        <p>No posters available.</p>
      )}

      {!loading && films.length === 0 && (
        <p>Upload a file with some 5-star films to see results.</p>
      )}
    </div>
  );
}
