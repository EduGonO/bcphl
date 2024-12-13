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
  id: number;
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


const fetchMovieDetails = async (movieId: number): Promise<TMDBMovie> => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}`;

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
    console.error('Error in TMDB:', error);
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

  try {
    // Fetch detailed data for more accurate genre classification
    const detailedMovie = await fetchMovieDetails(movie.id);

    if (detailedMovie.genres) {
      const genreNames = detailedMovie.genres.map(g => g.name.toLowerCase());
      if (genreNames.includes('science fiction') || genreNames.includes('mystery') || genreNames.includes('drama')) {
        x = 0.3; // More complex narratives
      }
      if (genreNames.includes('action') || genreNames.includes('comedy')) {
        x = 0.7; // Simpler narratives
      }
    }

    if (detailedMovie.vote_average !== undefined) {
      y = detailedMovie.vote_average > 7 ? 0.8 : 0.4; // Higher ratings imply more artistic intent
    }

    if (detailedMovie.overview && detailedMovie.overview.toLowerCase().includes('experimental')) {
      x = 0.2;
      y = 0.9;
    }

    // Supplement with Wikipedia data
    const wikipediaData = await fetchWikipediaData(detailedMovie.title);
    return { x: (x + wikipediaData.x) / 2, y: (y + wikipediaData.y) / 2 };
  } catch (error) {
    console.error(`Error in classifyFilm for "${movie.title}":`, error);
    return { x, y };
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
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Left Side: 2D Chart */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid #ccc' }}>
        <div style={{ position: 'relative', width: '90%', paddingBottom: '90%', backgroundColor: '#f9f9f9', border: '1px solid #ccc', borderRadius: '8px' }}>
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
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                border: '1px solid #ddd',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Right Side: Scrollable List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <ul style={{ padding: '0', margin: '0', listStyle: 'none' }}>
          {displayFilms.map((film, i) => (
            <li 
              key={i} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '15px', 
                marginBottom: '10px', 
                background: '#fff', 
                borderRadius: '8px', 
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' 
              }}
            >
              {film.posterPath && (
                <img 
                  src={film.posterPath} 
                  alt={film.name} 
                  style={{ width: '50px', height: '75px', borderRadius: '4px', marginRight: '15px' }}
                />
              )}
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 5px 0' }}>{film.name} ({film.year})</h3>
                <p style={{ margin: '0', color: '#555', fontSize: '14px' }}><strong>Genres:</strong> {film.genres?.map(g => g.name).join(', ') || 'N/A'}</p>
                <p style={{ margin: '0', color: '#555', fontSize: '14px' }}><strong>Rating:</strong> {film.vote_average || 'N/A'} ({film.vote_count || 'N/A'} votes)</p>
                <p style={{ margin: '0', color: '#777', fontSize: '12px', marginTop: '5px' }}><strong>X:</strong> {film.x.toFixed(2)}, <strong>Y:</strong> {film.y.toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
