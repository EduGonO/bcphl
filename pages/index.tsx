import React, { useState, useEffect } from 'react';

type Article = {
  title: string;
  category: string;
  content: string;
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
      }}
    >
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
          <div
            key={index}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              background: '#f9f9f9',
            }}
          >
            <h2 style={{ margin: '0 0 10px' }}>{article.title}</h2>
            <p style={{ color: '#555', marginBottom: '10px' }}>
              <strong>Category:</strong> {article.category}
            </p>
            <p style={{ color: '#777', whiteSpace: 'pre-wrap' }}>{article.content.slice(0, 200)}...</p>
          </div>
        ))}
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

          // Extract title (first line of the file as Markdown convention)
          const firstLine = fileContents.split('\n')[0];
          const title = firstLine.startsWith('#') ? firstLine.replace(/^#+\s*/, '') : file.replace('.md', '');

          // Content is the rest of the file
          const content = fileContents.split('\n').slice(1).join('\n').trim();

          articles.push({ title, category, content });
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