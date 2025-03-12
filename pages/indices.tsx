import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import Header from '../app/components/Header';

type TextEntry = {
  title: string;
  slug: string;
};

type CategoryIndex = {
  name: string;
  texts: TextEntry[];
};

type IndicesProps = {
  indices: CategoryIndex[];
};

const Indices: React.FC<IndicesProps> = ({ indices }) => {
  const totalCategories = indices.length;
  const totalArticles = indices.reduce((acc, cur) => acc + cur.texts.length, 0);
  return (
    <>
      <Head>
        <title>Indices – BICÉPHALE</title>
        <meta name="description" content="Index of all categories and texts" />
      </Head>
      <Header
        categories={indices.map((cat) => ({ name: cat.name, color: '#607d8b' }))}
        layout="horizontal"
      />
      <div
        style={{
          maxWidth: '800px',
          margin: '80px auto',
          padding: '20px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          color: '#333',
        }}
      >
        <h1 style={{ fontSize: '24px', marginBottom: '10px', textAlign: 'center' }}>
          Indices
        </h1>
        <p style={{ fontSize: '14px', textAlign: 'center', marginBottom: '30px' }}>
          {totalCategories} categories, {totalArticles} articles
        </p>
        {indices.map((cat) => (
          <section key={cat.name} style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', marginBottom: '10px' }}>{cat.name}</h2>
            <ul style={{ listStyle: 'none', margin: 0, paddingLeft: '20px' }}>
              {cat.texts.map((text) => (
                <li key={text.slug} style={{ marginBottom: '5px' }}>
                  <Link href={`/${cat.name}/${text.slug}`}>
                    <a style={{ fontSize: '12px', color: '#333', textDecoration: 'none' }}>
                      {text.title}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
};

export async function getStaticProps() {
  const textsDir = path.join(process.cwd(), 'texts');
  const categoryFolders = fs
    .readdirSync(textsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const indices: CategoryIndex[] = categoryFolders.map((category) => {
    const categoryPath = path.join(textsDir, category);
    const files = fs.readdirSync(categoryPath).filter((file) => file.endsWith('.md'));
    const texts: TextEntry[] = files.map((file) => {
      const filePath = path.join(categoryPath, file);
      const content = fs.readFileSync(filePath, 'utf-8').trim();
      const lines = content.split('\n').map((line) => line.trim());
      const slug = file.replace('.md', '');
      const title = lines[0].startsWith('#') ? lines[0].replace(/^#+\s*/, '') : slug;
      return { title, slug };
    });
    return { name: category, texts };
  });

  return { props: { indices } };
}

export default Indices;
