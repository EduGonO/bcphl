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
  genres?: { id: number; name: string }[];
  vote_average?: number;
  vote_count?: number;
  x: number;
  y: number;
};

type TMDBMovie = {
  title: string;
  release_date: string;
  poster_path?: string;
  overview?: string;
  genres?: { id: number; name: string }[];
  vote_average?: number;
  vote_count?: number;
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






const fetchWikipediaData = async (filmName: string): Promise<{ x: number; y: number }> => {
  try {
    const response = await fetch(`https://en.wikipedia.org/wiki/${encodeURIComponent(filmName)}`);
    if (!response.ok) {
      console.error(`Failed to fetch Wikipedia page for ${filmName}`);
      return { x: 0.5, y: 0.5 };
    }

    const html = await response.text();

    // Extract all text to avoid reliance on headings
    const bodyMatch = html.match(/<body.*?>([\s\S]*?)<\/body>/i);
    const bodyText = bodyMatch ? bodyMatch[1].replace(/<[^>]+>/g, '').toLowerCase() : '';

    // Heuristics for narrative complexity (x)
    let x = 0.5;
    if (bodyText.includes('nonlinear') || bodyText.includes('complex') || bodyText.includes('experimental')) {
      x = 0.2;
    } else if (bodyText.includes('simple') || bodyText.includes('straightforward')) {
      x = 0.8;
    }

    // Heuristics for artistic intent (y)
    let y = 0.5;
    if (bodyText.includes('masterpiece') || bodyText.includes('critically acclaimed') || bodyText.includes('innovative')) {
      y = 0.8;
    } else if (bodyText.includes('blockbuster') || bodyText.includes('mainstream') || bodyText.includes('commercial')) {
      y = 0.3;
    }

    return { x, y };
  } catch (error) {
    console.error(`Error scraping Wikipedia for ${filmName}:`, error);
    return { x: 0.5, y: 0.5 };
  }
};

const classifyFilm = async (movie: TMDBMovie): Promise<{ x: number; y: number }> => {
  let x = 0.5; // Default narrative complexity
  let y = 0.5; // Default artistic intent

  // Use TMDB data if available
  if (movie.genres) {
    const genreNames = movie.genres.map(g => g.name.toLowerCase());
    if (genreNames.includes('science fiction') || genreNames.includes('mystery') || genreNames.includes('drama')) {
      x = 0.3; // More complex narratives
    }
    if (genreNames.includes('action') || genreNames.includes('comedy')) {
      x = 0.7; // Simpler narratives
    }
  }

  if (movie.vote_average !== undefined) {
    y = movie.vote_average > 7 ? 0.8 : 0.4; // Higher ratings imply more artistic intent
  }

  if (movie.overview && movie.overview.toLowerCase().includes('experimental')) {
    x = 0.2;
    y = 0.9;
  }

  // Supplement with Wikipedia data
  const wikipediaData = await fetchWikipediaData(movie.title);
  return { x: (x + wikipediaData.x) / 2, y: (y + wikipediaData.y) / 2 };
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
            const { x, y } = movie ? await classifyFilm(movie) : { x: 0.5, y: 0.5 };

            return {
              ...film,
              posterPath: movie?.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : undefined,
              overview: movie?.overview,
              genres: movie?.genres,
              vote_average: movie?.vote_average,
              vote_count: movie?.vote_count,
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
        <>
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

          <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0 }}>
            {displayFilms.map((film, i) => (
              <li key={i} style={{ marginBottom: '20px' }}>
                <strong>{film.name}, {film.year} - {film.rating}</strong>
                {film.posterPath && (
                  <img 
                    src={film.posterPath} 
                    alt={film.name} 
                    style={{ width: '50px', marginLeft: '10px' }} 
                  />
                )}
                <p>Genres: {film.genres?.map(g => g.name).join(', ') || 'N/A'}</p>
                <p>Vote Average: {film.vote_average || 'N/A'} (Votes: {film.vote_count || 'N/A'})</p>
                <p>Overview: {film.overview || 'No overview available.'}</p>
                <p>X: {film.x.toFixed(2)}, Y: {film.y.toFixed(2)}</p>
              </li>
            ))}
          </ul>
        </>
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
