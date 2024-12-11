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

    setLoading(true);
    const results = await Promise.all(
      films.map(async (film) => {
        try {
          const data = await fetchMovie(film.name, film.year);
          const movie = data.results?.find(
            (m: TMDBMovie) =>
              m.title.toLowerCase().includes(film.name.toLowerCase()) &&
              m.release_date?.startsWith(film.year)
          );

          if (!movie) {
            console.warn(`No match found for "${film.name}"`);
          }

          return {
            ...film,
            posterPath: movie?.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : undefined,
            overview: movie?.overview,
          };
        } catch (error) {
          console.error(`Error fetching TMDB data for "${film.name}":`, error);
          return {
            ...film,
            overview: `Error fetching data for "${film.name}"`,
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