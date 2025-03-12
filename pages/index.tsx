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

const Home: React.FC<{ articles: Article[]; categories: Category[] }> = ({ articles, categories }) => {
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [layout, setLayout] = useState<'vertical' | 'horizontal'>('horizontal');
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
      setBackgroundColor('#ffffff');
    }
  };

  const mainStyle: React.CSSProperties =
    layout === 'vertical'
      ? { marginLeft: '250px', padding: '20px' }
      : { marginTop: '140px', padding: '20px' };

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
            {filteredArticles.map((article, i) => {
              const catColor = categories.find((c) => c.name === article.category)?.color || '#f0f0f0';
              return (
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
                          color: '#000',
                        }}
                      >
                        {article.title}
                      </h3>
                    </a>
                    <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#666' }}>
                      {article.date} • {article.author}
                    </p>
                    <div
                      style={{
                        display: 'inline-block',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        padding: '3px 8px',
                        color: catColor,
                        border: `1px solid ${catColor}`,
                        backgroundColor: catColor + '20',
                        borderRadius: '4px',
                        marginBottom: '10px',
                      }}
                    >
                      {article.category}
                    </div>
                    <p style={{ margin: '0 0 10px', fontSize: '14px', color: '#444' }}>
                      {article.preview}
                    </p>
                  </div>
                </div>
              );
            })}
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

  const categoryFolders = fs
    .readdirSync(textsDir, { withFileTypes: true })
    .filter((dirent: any) => dirent.isDirectory())
    .map((dirent: any) => dirent.name);

  const categories: Category[] = categoryFolders.map((cat: string) => ({
    name: cat,
    color: '#607d8b', // default color
  }));

  for (const cat of categoryFolders) {
    const catPath = path.join(textsDir, cat);
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
  return { props: { articles, categories } };
}

export default Home;
