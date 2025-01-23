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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');

  const handleCategoryChange = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null);
      setFilteredArticles(articles);
      setBackgroundColor('#ffffff');
    } else {
      setActiveCategory(category);
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
          <img src="/media/logo.png" alt="Logo" style={{ maxHeight: '320px' }} />
        </div>

        {/* Category Selector */}
        <div style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryChange(cat.name)}
              style={{
                margin: '10px',
                width: 'auto',
                height: 'auto',
                padding: '5px 0',
                writingMode: 'vertical-rl',
                textAlign: 'center',
                fontSize: '14px',
                border: '1px solid #ccc',
                backgroundColor: activeCategory === cat.name ? cat.color : '#fff',
                color: activeCategory === cat.name ? '#fff' : '#000',
                cursor: 'pointer',
                fontWeight: 'bold',
                borderRadius: '5px',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
            </button>
          ))}
        </div>

        {/* Current Category Title */}
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            textAlign: 'left',
            marginBottom: '20px',
            color: '#333',
          }}
        >
          {activeCategory ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) : 'Articles Recents'}
        </h2>

        {/* Articles */}
        <div>
          {filteredArticles.map((article, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: '15px',
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  width: '42px',
                  height: '60px',
                  backgroundColor: '#e0e0e0',
                  marginRight: '15px',
                  borderRadius: '4px',
                }}
              ></div>

              {/* Article Content */}
              <Link href={`/${article.category}/${article.title.toLowerCase().replace(/\s+/g, '-')}`}>
                <a
                  style={{
                    textDecoration: 'none', // Remove underline for the link
                    color: 'inherit', // Inherit text color
                    display: 'block',
                    flex: '1',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 5px',
                      fontSize: '18px',
                      textDecoration: 'none', // Ensure no underline
                      color: '#000',
                    }}
                  >
                    {article.title}
                  </h3>
                  <p
                    style={{
                      margin: '0 0 5px',
                      fontSize: '14px',
                      color: '#666',
                      textDecoration: 'none', // Ensure no underline
                    }}
                  >
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
                      textDecoration: 'none', // Ensure no underline
                    }}
                  >
                    {article.category}
                  </div>
                  <p
                    style={{
                      margin: '0 0 10px',
                      fontSize: '14px',
                      color: '#444',
                      textDecoration: 'none', // Ensure no underline
                    }}
                  >
                    {article.preview}
                  </p>
                  <hr
                    style={{
                      border: 'none',
                      borderBottom: '1px solid #ddd',
                      width: '80%',
                      margin: '0 auto',
                    }}
                  />
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