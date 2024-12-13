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
  genres?: { id: number; name: string }[];
  vote_average?: number;
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







const fetchWikipediaData = async (filmName: string): Promise<{ plotKeywords: string[]; receptionKeywords: string[] }> => {
  try {
    const response = await fetch(`https://en.wikipedia.org/wiki/${encodeURIComponent(filmName)}`);
    if (!response.ok) {
      console.error(`Failed to fetch Wikipedia page for ${filmName}`);
      return { plotKeywords: [], receptionKeywords: [] };
    }

    const html = await response.text();
    const plotMatch = html.match(/<h2>.*?Plot.*?<p>(.*?)<\/p>/s);
    const receptionMatch = html.match(/<h2>.*?Reception.*?<p>(.*?)<\/p>/s);

    const plotKeywords = plotMatch ? plotMatch[1].toLowerCase().split(/\W+/) : [];
    const receptionKeywords = receptionMatch ? receptionMatch[1].toLowerCase().split(/\W+/) : [];

    return { plotKeywords, receptionKeywords };
  } catch (error) {
    console.error(`Error scraping Wikipedia for ${filmName}:`, error);
    return { plotKeywords: [], receptionKeywords: [] };
  }
};

const classifyFilm = async (movie: TMDBMovie): Promise<{ x: number; y: number }> => {
  let x = 0.5; // Narrative complexity
  let y = 0.5; // Artistic intent

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
    x = 0.2; // Strong narrative complexity
    y = 0.9; // Artistic focus
  }

  // Scrape additional data
  const { plotKeywords, receptionKeywords } = await fetchWikipediaData(movie.title);

  if (plotKeywords.includes('nonlinear') || plotKeywords.includes('complex')) {
    x = Math.min(x, 0.3); // Favor more complexity
  }
  if (receptionKeywords.includes('blockbuster') || receptionKeywords.includes('mainstream')) {
    y = Math.max(y, 0.3); // Favor commercial intent
  }

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
            const { x, y } = movie ? await classifyFilm(movie) : { x: 0.5, y: 0.5 };

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
