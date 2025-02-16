import React, { useState } from 'react';
import Head from 'next/head';
import Header, { Category } from '../app/components/Header';
import DebugOverlay from '../app/components/DebugOverlay';
import Footer from '../app/components/Footer';

export type Article = {
  title: string;
  slug: string;
  category: string;
  date: string;
  author: string;
  preview: string;
};

export const categories: Category[] = [
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
  const [layout, setLayout] = useState<'vertical' | 'horizontal'>('vertical');
  const [bodyFontSize, setBodyFontSize] = useState<number>(16);
  const [titleFont, setTitleFont] = useState<'Gaya' | 'Avenir'>('Gaya');
  const [imagePreview, setImagePreview] = useState<boolean>(false);

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

  const mainStyle: React.CSSProperties =
    layout === 'vertical'
      ? { marginLeft: '250px', padding: '20px' }
      : { marginTop: '80px', padding: '20px' };

  return (
    <>
      <Head>
        <style jsx global>{`
          @font-face {
            font-family: 'AvenirNextCondensed';
            src: url('/fonts/AvenirNextCondensed-Regular.otf') format('opentype');
            font-display: swap;
          }
          @font-face {
            font-family: 'GayaRegular';
            src: url('/fonts/gaya-regular.otf') format('opentype');
            font-display: swap;
          }
          @font-face {
            font-family: 'AvenirNextBolder';
            src: url('/fonts/AvenirNextBolder.otf') format('opentype');
            font-display: swap;
          }
          body {
            margin: 0;
            font-family: 'AvenirNextCondensed', Arial, sans-serif;
          }
        `}</style>
      </Head>
      <div style={{ backgroundColor, transition: 'background-color 0.3s ease', fontSize: `${bodyFontSize}px` }}>
        <Header
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          layout={layout}
        />
        <main style={mainStyle}>
          <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
            {filteredArticles.map((article, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '60px',
                    backgroundColor: '#e0e0e0',
                    marginRight: '15px',
                    borderRadius: '4px',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <a href={`/${article.category}/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3
                      style={{
                        margin: '0 0 5px',
                        fontSize: '18px',
                        fontFamily: titleFont === 'Gaya' ? 'GayaRegular' : 'AvenirNextBolder',
                        color: activeCategory ? '#fff' : '#000',
                      }}
                    >
                      {article.title}
                    </h3>
                  </a>
                  <p style={{ margin: '0 0 5px', fontSize: '14px', color: activeCategory ? '#fff' : '#666' }}>
                    {article.date} • {article.author}
                  </p>
                  <div
                    style={{
                      display: 'inline-block',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '3px 8px',
                      color:
                        activeCategory
                          ? '#000'
                          : categories.find((c) => c.name === article.category)?.color || '#000',
                      border: `1px solid ${
                        activeCategory
                          ? 'rgba(255,255,255,0.8)'
                          : categories.find((c) => c.name === article.category)?.color || '#000'
                      }`,
                      backgroundColor:
                        activeCategory
                          ? 'rgba(255,255,255,0.8)'
                          : (categories.find((c) => c.name === article.category)?.color || '#f0f0f0') + '20',
                      borderRadius: '4px',
                      marginBottom: '10px',
                    }}
                  >
                    {article.category}
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: '14px', color: activeCategory ? '#fff' : '#444' }}>
                    {article.preview}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Footer />
        </main>
        <DebugOverlay
  layout={layout}
  onToggleLayout={() => setLayout(layout === 'vertical' ? 'horizontal' : 'vertical')}
  bodyFontSize={bodyFontSize}
  onBodyFontSizeChange={setBodyFontSize}
  titleFont={titleFont}
  onTitleFontChange={setTitleFont}
  imagePreview={imagePreview}
  onToggleImagePreview={() => setImagePreview(!imagePreview)}
  articleSidebar={false}
  onToggleArticleSidebar={() => {}}
/>

      </div>
    </>
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
          const fileContents = fs.readFileSync(filePath, 'utf-8').trim();
          const lines = fileContents.split('\n').map((l: string) => l.trim());
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
