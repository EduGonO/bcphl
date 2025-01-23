import React, { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';

type Article = {
  title: string;
  category: string;
  content: string;
};

const categories = [
  'actu',
  'interviews & reportage',
  'new',
  'design',
  'program',
  'livre et film',
  'archives',
];

const loadArticles = (): Article[] => {
  const categoriesDir = path.join(process.cwd(), 'pages/text');
  const articles: Article[] = [];

  for (const category of categories) {
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

  return articles;
};

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    const allArticles = loadArticles();
    setArticles(allArticles);
    setFilteredArticles(allArticles);
  }, []);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter((article) => article.category === category));
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <img src="/media/logo.png" alt="Logo" style={{ maxHeight: '100px' }} />
      </div>

      {/* Category Selector */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {['all', ...categories].map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            style={{
              margin: '0 10px',
              padding: '10px 15px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              backgroundColor: activeCategory === category ? '#000' : '#fff',
              color: activeCategory === category ? '#fff' : '#000',
              cursor: 'pointer',
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

export default Home;