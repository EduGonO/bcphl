import React from 'react';
import fs from 'fs';
import path from 'path';
import { GetStaticProps, GetStaticPaths } from 'next';

export const getStaticPaths: GetStaticPaths = async () => {
  const categoriesDir = path.join(process.cwd(), 'text');
  const paths: { params: { slug: string } }[] = [];

  const categories = fs.readdirSync(categoriesDir);
  categories.forEach((category) => {
    const categoryPath = path.join(categoriesDir, category);
    if (fs.lstatSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath);
      files.forEach((file) => {
        if (file.endsWith('.md')) {
          paths.push({
            params: { slug: `${category}/${file.replace('.md', '')}` },
          });
        }
      });
    }
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slugParts = (params?.slug as string).split('/');
  const category = slugParts[0];
  const slug = slugParts[1];

  const filePath = path.join(process.cwd(), 'text', category, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContents.split('\n').map((line: string) => line.trim());

  const title = lines[0].startsWith('#') ? lines[0].replace(/^#+\s*/, '') : 'Untitled';
  const date = lines[1] || 'Unknown Date';
  const author = lines[2] || 'Unknown Author';
  const content = lines.slice(3).join('\n').trim();

  return {
    props: {
      title,
      date,
      author,
      category,
      content,
    },
  };
};

const ArticlePage: React.FC<{
  title: string;
  date: string;
  author: string;
  category: string;
  content: string;
}> = ({ title, date, author, category, content }) => {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => window.history.back()}
          style={{
            backgroundColor: '#f44336',
            color: '#fff',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Back
        </button>
        <img src="/media/logo.png" alt="Logo" style={{ height: '40px' }} />
      </div>

      {/* Article Details */}
      <h1 style={{ margin: '0 0 10px' }}>{title}</h1>
      <p style={{ margin: '0 0 10px', color: '#555' }}>
        {date} • {author} • {category.charAt(0).toUpperCase() + category.slice(1)}
      </p>

      {/* Article Content */}
      <div
        style={{
          marginTop: '20px',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          color: '#333',
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default ArticlePage;