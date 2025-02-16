import React, { useState } from 'react';
import Link from 'next/link';
import Header from '../app/components/Header';

export type Article = {
  title: string;
  slug: string;
  category: string;
  date: string;
  author: string;
  preview: string;
};

export const categories = [
  { name: 'actu', color: '#f44336' },
  { name: 'interviews & reportage', color: '#3f51b5' },
  { name: 'new', color: '#4caf50' },
  { name: 'design', color: '#ff9800' },
  { name: 'program', color: '#9c27b0' },
  { name: 'livre et film', color: '#009688' },
  { name: 'archives', color: '#607d8b' },
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
      setFilteredArticles(articles.filter((a) => a.category === category));
      const catColor = categories.find((c) => c.name === category)?.color || '#ffffff';
      setBackgroundColor(catColor);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor, minHeight: '100vh', transition: 'background-color 0.3s ease', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <Header categories={categories} activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
        {filteredArticles.map((article, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px' }}>
            <div style={{ width: '42px', height: '60px', backgroundColor: '#e0e0e0', marginRight: '15px', borderRadius: '4px' }}></div>
            <div style={{ flex: 1 }}>
              <Link href={`/${article.category}/${article.slug}`}>
                <a style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ margin: '0 0 5px', fontSize: '18px', color: activeCategory ? '#fff' : '#000' }}>
                    {article.title}
                  </h3>
                </a>
              </Link>
              <p style={{ margin: '0 0 5px', fontSize: '14px', color: activeCategory ? '#fff' : '#666' }}>
                {article.date} • {article.author}
              </p>
              <div style={{
                display: 'inline-block',
                fontSize: '12px',
                fontWeight: 'bold',
                padding: '3px 8px',
                color: activeCategory ? '#000' : categories.find(c => c.name === article.category)?.color || '#000',
                border: `1px solid ${activeCategory ? 'rgba(255,255,255,0.8)' : categories.find(c => c.name === article.category)?.color || '#000'}`,
                backgroundColor: activeCategory ? 'rgba(255,255,255,0.8)' : (categories.find(c => c.name === article.category)?.color + '20' || '#f0f0f0'),
                borderRadius: '4px',
                marginBottom: '10px'
              }}>
                {article.category}
              </div>
              <p style={{ margin: '0 0 10px', fontSize: '14px', color: activeCategory ? '#fff' : '#444' }}>
                {article.preview}
              </p>
            </div>
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
  const textsDir = path.join(process.cwd(), 'texts');

  for (const catObj of categories) {
    const cat = catObj.name;
    const catPath = path.join(textsDir, cat);
    if (fs.existsSync(catPath)) {
      fs.readdirSync(catPath).forEach((file: string) => {
        if (file.endsWith('.md')) {
          const filePath = path.join(catPath, file);
          const content = fs.readFileSync(filePath, 'utf-8').trim();
          const lines = content.split('\n').map(l => l.trim());
          const slug = file.replace('.md', '');
          const title = lines[0].startsWith('#') ? lines[0].replace(/^#+\s*/, '') : slug;
          const date = lines[1] || 'Unknown Date';
          const author = lines[2] || 'Unknown Author';
          const preview = lines.slice(3).join(' ').slice(0, 80) + '...';
          articles.push({ title, slug, category: cat, date, author, preview });
        }
      });
    }
  }

  return { props: { articles } };
}

export default Home;
