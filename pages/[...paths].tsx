import React, { useState } from 'react';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import { GetStaticProps, GetStaticPaths } from 'next';
import Header, { Category } from '../app/components/Header';
import DebugOverlay from '../app/components/DebugOverlay';
import Footer from '../app/components/Footer';

export const getStaticPaths: GetStaticPaths = async () => {
  const textsDir = path.join(process.cwd(), 'texts');
  const pathsArr: { params: { paths: string[] } }[] = [];
  if (fs.existsSync(textsDir)) {
    fs.readdirSync(textsDir).forEach((cat) => {
      const catPath = path.join(textsDir, cat);
      if (fs.lstatSync(catPath).isDirectory()) {
        fs.readdirSync(catPath).forEach((file) => {
          if (file.endsWith('.md')) {
            pathsArr.push({ params: { paths: [cat, file.replace('.md', '')] } });
          }
        });
      }
    });
  }
  return { paths: pathsArr, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const [category, slug] = params?.paths as string[];
  const filePath = path.join(process.cwd(), 'texts', category, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContents.split('\n').map((l: string) => l.trim());
  const title = lines[0].startsWith('#') ? lines[0].replace(/^#+\s*/, '') : 'Untitled';
  const date = lines[1] || 'Unknown Date';
  const author = lines[2] || 'Unknown Author';
  const content = lines.slice(3).join('\n').trim();
  return { props: { title, date, author, category, content } };
};

const ArticlePage: React.FC<{
  title: string;
  date: string;
  author: string;
  category: string;
  content: string;
}> = ({ title, date, author, category, content }) => {
  const cats: Category[] = [
    { name: 'Love Letters', color: '#f44336' },
    { name: 'Image-Critique', color: '#3f51b5' },
    { name: 'Bascule', color: '#4caf50' },
    { name: 'Sensure', color: '#ff9800' },
    { name: 'Automaton', color: '#9c27b0' },
    { name: 'Bicaméralité', color: '#009688' },
    { name: 'Banque des rêves', color: '#607d8b' },
    { name: 'Cartographie', color: '#607d8b' },
  ];

  const [layout, setLayout] = useState<'vertical' | 'horizontal'>('vertical');
  const [bodyFontSize, setBodyFontSize] = useState<number>(16);
  const [bodyFont, setBodyFont] = useState<'InterRegular' | 'AvenirNextCondensed'>('InterRegular');
  const [titleFont, setTitleFont] = useState<'RecoletaMedium' | 'GayaRegular'>('RecoletaMedium');
  const [imagePreview, setImagePreview] = useState<boolean>(true);
  const [showArticleSidebar, setShowArticleSidebar] = useState<boolean>(true);

  const mainStyle: React.CSSProperties =
    layout === 'vertical'
      ? { marginLeft: '250px', padding: '20px' }
      : { marginTop: '140px', padding: '20px' };

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  return (
    <>
      <Head>
        <title>{title}</title>
        {/* Note: Global font declarations are now in your global CSS */}
      </Head>
      <div style={{ backgroundColor: '#fff', fontSize: `${bodyFontSize}px`, fontFamily: bodyFont }}>
        <Header categories={cats} layout={layout} />
        <main style={mainStyle}>
          <div style={{ display: 'flex', gap: '20px', margin: '0 auto', maxWidth: '1200px' }}>
            <div style={{ flex: 1 }}>
              {imagePreview && (
                <img
                  src="/media/exampleImage.jpg"
                  alt="Article Preview"
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '20px',
                  }}
                />
              )}
              <h1 style={{ margin: '0 0 10px', fontFamily: titleFont }}>
                {title}
              </h1>
              <p style={{ margin: '0 0 10px', color: '#555' }}>
                {date} • {author} • {category.charAt(0).toUpperCase() + category.slice(1)}
              </p>
              <div style={{ marginTop: '20px', lineHeight: '1.6', whiteSpace: 'pre-wrap', color: '#333' }}>
                {content}
              </div>
            </div>
            {/* Sidebar: Always on the right, fixed to max 20% width */}
            {showArticleSidebar && (
              <aside
                style={{
                  width: '20%',
                  minWidth: '200px',
                  borderLeft: '1px solid #ddd',
                  paddingLeft: '24px', // increased padding to push content to the right
                  paddingRight: '24px',
                  paddingTop: '24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <span style={headerCategoryStyle}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                  <span style={{ color: 'gray', fontSize: '14px' }}>
                    {formattedDate}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: 'gray',
                    }}
                  />
                  <h4 style={{ margin: 0 }}>{author}</h4>
                </div>

                <p style={{ fontStyle: 'italic', marginBottom: '10px' }}>
                  Ceci est une courte biographie de l'auteur qui est une courte biographie de l'auteur.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <a
                    href="#"
                    style={{
                      textDecoration: 'none',
                      color: '#3f51b5',
                      marginRight: '10px',
                    }}
                  >
                    Portfolio
                  </a>
                  <a
                    href="#"
                    style={{
                      textDecoration: 'none',
                      color: '#3f51b5',
                      marginRight: '10px',
                    }}
                  >
                    Twitter
                  </a>
                  <a
                    href="#"
                    style={{
                      textDecoration: 'none',
                      color: '#3f51b5',
                    }}
                  >
                    LinkedIn
                  </a>
                </div>

                <h4 style={{ marginBottom: '4px' }}>References</h4>
                <ul
                  style={{
                    paddingLeft: '20px',
                    marginTop: '4px',
                    marginBottom: '20px',
                  }}
                >
                  <li>
                    <a
                      href="#"
                      style={{
                        textDecoration: 'none',
                        color: '#3f51b5',
                      }}
                    >
                      Example Reference 1
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{
                        textDecoration: 'none',
                        color: '#3f51b5',
                      }}
                    >
                      Example Reference 2
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      style={{
                        textDecoration: 'none',
                        color: '#3f51b5',
                      }}
                    >
                      Example Reference 3
                    </a>
                  </li>
                </ul>

                <h4>Commentaires</h4>
                <ul
                  style={{
                    paddingLeft: '20px',
                    marginTop: '4px',
                    marginBottom: '20px',
                  }}
                >
                  <li>
                    <strong>User1:</strong> Example de commentaire
                  </li>
                  <li>
                    <strong>User2:</strong> Un autre exemple de commentaire.
                  </li>
                </ul>
              </aside>
            )}
          </div>
          <Footer />
        </main>
        <DebugOverlay
          layout={layout}
          onToggleLayout={() => setLayout(layout === 'vertical' ? 'horizontal' : 'vertical')}
          bodyFontSize={bodyFontSize}
          onBodyFontSizeChange={setBodyFontSize}
          bodyFont={bodyFont}
          onBodyFontChange={setBodyFont}
          titleFont={titleFont}
          onTitleFontChange={setTitleFont}
          imagePreview={imagePreview}
          onToggleImagePreview={() => setImagePreview(!imagePreview)}
          articleSidebar={showArticleSidebar}
          onToggleArticleSidebar={() => setShowArticleSidebar(!showArticleSidebar)}
        />
      </div>
    </>
  );
};

export default ArticlePage;
