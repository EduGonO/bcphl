import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';

type TextEntry = {
  title: string;
  slug: string;
  date: string;
  author: string;
  preview: string;
};

type CategoryIndex = {
  name: string;
  texts: TextEntry[];
};

type IndicesProps = {
  indices: CategoryIndex[];
};

const Indices: React.FC<IndicesProps> = ({ indices }) => {
  return (
    <>
      <Head>
        <title>Indices – BICÉPHALE</title>
        <meta name="description" content="Elegant index of all categories and texts." />
      </Head>
      <div
        style={{
          maxWidth: '800px',
          margin: '80px auto',
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
          lineHeight: 1.5,
          color: '#333',
        }}
      >
        <h1 style={{ fontSize: '36px', marginBottom: '20px', textAlign: 'center' }}>Indices</h1>
        {indices.map((cat) => (
          <section key={cat.name} style={{ marginBottom: '40px' }}>
            <h2
              style={{
                fontSize: '28px',
                borderBottom: '2px solid #ddd',
                paddingBottom: '10px',
                marginBottom: '20px',
              }}
            >
              {cat.name}
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {cat.texts.map((text) => (
                <li key={text.slug} style={{ marginBottom: '15px' }}>
                  <Link href={`/${cat.name}/${text.slug}`}>
                    <a style={{ textDecoration: 'none', color: '#333' }}>
                      <h3 style={{ fontSize: '20px', margin: '0 0 5px' }}>{text.title}</h3>
                      <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                        {text.date} • {text.author}
                      </p>
                      <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#444' }}>
                        {text.preview}
                      </p>
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
      const date = lines[1] || 'Unknown Date';
      const author = lines[2] || 'Unknown Author';
      const preview = lines.slice(3).join(' ').slice(0, 80) + '...';
      return { title, slug, date, author, preview };
    });
    return { name: category, texts };
  });

  return {
    props: {
      indices,
    },
  };
}

export default Indices;
