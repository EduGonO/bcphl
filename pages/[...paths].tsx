import React from 'react';
import fs from 'fs';
import path from 'path';
import { GetStaticProps, GetStaticPaths } from 'next';
import Header from '../app/components/Header';

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
  const [cat, slug] = params?.paths as string[];
  const filePath = path.join(process.cwd(), 'texts', cat, `${slug}.md`);
  if (!fs.existsSync(filePath)) return { notFound: true };
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').map(l => l.trim());
  const title = lines[0].startsWith('#') ? lines[0].replace(/^#+\s*/, '') : 'Untitled';
  const date = lines[1] || 'Unknown Date';
  const author = lines[2] || 'Unknown Author';
  const articleContent = lines.slice(3).join('\n').trim();

  return { props: { title, date, author, category: cat, content: articleContent } };
};

const ArticlePage: React.FC<{ title: string; date: string; author: string; category: string; content: string; }> = ({ title, date, author, category, content }) => {
  const cats = [
    { name: 'actu', color: '#f44336' },
    { name: 'interviews & reportage', color: '#3f51b5' },
    { name: 'new', color: '#4caf50' },
    { name: 'design', color: '#ff9800' },
    { name: 'program', color: '#9c27b0' },
    { name: 'livre et film', color: '#009688' },
    { name: 'archives', color: '#607d8b' },
  ];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Header categories={cats} showBackButton />
      <h1 style={{ margin: '0 0 10px' }}>{title}</h1>
      <p style={{ margin: '0 0 10px', color: '#555' }}>
        {date} • {author} • {category.charAt(0).toUpperCase() + category.slice(1)}
      </p>
      <div style={{ marginTop: '20px', lineHeight: '1.6', whiteSpace: 'pre-wrap', color: '#333' }}>
        {content}
      </div>
    </div>
  );
};

export default ArticlePage;
