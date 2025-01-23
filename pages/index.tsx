import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type Article = {
  title: string;
  category: string;
  date: string;
  author: string;
  preview: string;
};

const categories = [
  { name: 'actu', color: '#f44336' }, // Red
  { name: 'interviews & reportage', color: '#3f51b5' }, // Blue
  { name: 'new', color: '#4caf50' }, // Green
  { name: 'design', color: '#ff9800' }, // Orange
  { name: 'program', color: '#9c27b0' }, // Purple
  { name: 'livre et film', color: '#009688' }, // Teal
  { name: 'archives', color: '#607d8b' }, // Gray
];

const Home: React.FC<{ articles: Article[] }> = ({ articles }) => {
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredArticles(articles);
      setBackgroundColor('#ffffff'); // Default white background
    } else {
      setFilteredArticles(articles.filter((article) => article.category === category));
      const categoryColor = categories.find((cat) => cat.name === category)?.color || '#ffffff';
      setBackgroundColor(categoryColor);
    }
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        backgroundColor,
        minHeight: '100vh',
        transition: 'background-color 0.3s ease',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src="/media/logo.png" alt="Logo" style={{ maxHeight: '100px' }} />
        </div>

        {/* Category Selector */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {['all', ...categories.map((cat) => cat.name)].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              style={{
                margin: '10px',
                width: '100px',
                height: '100px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor:
                  activeCategory === category
                    ? categories.find((cat) => cat.name === category)?.color || '#000'
                    : '#fff',
                color: activeCategory === category ? '#fff' : '#000',
                cursor: 'pointer',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                fontWeight: 'bold',
                transition: 'all 0.2s ease',
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Articles */}
        <div>
          {filteredArticles.map((article, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <Link href={`/article?slug=${article.category}/${article.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <a style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <h3 style={{ margin: '0 0 5px', fontSize: '18px' }}>{article.title}</h3>
                  <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#666' }}>
                    {article.date} • {article.author}
                  </p>
                  <div
                    style={{
                      display: 'inline-block',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '3px 8px',
                      color: categories.find((cat) => cat.name === article.category)?.color || '#000',
                      border: `1px solid ${categories.find((cat) => cat.name === article.category)?.color || '#000'}`,
                      backgroundColor:
                        categories.find((cat) => cat.name === article.category)?.color + '20' || '#f0f0f0',
                      borderRadius: '4px',
                      marginBottom: '10px',
                    }}
                  >
                    {article.category}
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: '14px', color: '#444' }}>{article.preview}</p>
                  <hr style={{ border: 'none', borderBottom: '1px solid #ddd', width: '80%' }} />
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const fs = require('fs');
  const path = require('path');

  const articles: Article[] = [];

  const categoriesDir = path.join(process.cwd(), 'pages/text');

  for (const categoryObj of categories) {
    const category = categoryObj.name;
    const categoryPath = path.join(categoriesDir, category);
    if (fs.existsSync(categoryPath)) {
      const files = fs.readdirSync(categoryPath);

      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = path.join(categoryPath, file);
          const fileContents = fs.readFileSync(filePath, 'utf-8').trim();
          const lines = fileContents.split('\n').map((line: string) => line.trim());

          // Extract metadata
          const title = lines[0].startsWith('#') ? lines[0].replace(/^#+\s*/, '') : file.replace('.md', '');
          const date = lines[1] || 'Unknown Date';
          const author = lines[2] || 'Unknown Author';
          const preview = lines.slice(3).join(' ').slice(0, 80) + '...';

          articles.push({ title, category, date, author, preview });
        }
      }
    }
  }

  return {
    props: {
      articles,
    },
  };
}

export default Home;