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
          margin: '60px auto',
          padding: '20px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          color: '#333',
          backgroundColor: '#fafafa',
        }}
      >
        <h1 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>
          Indices
        </h1>
        {indices.map((cat) => (
          <section key={cat.name} style={{ marginBottom: '30px' }}>
            <h2
              style={{
                fontSize: '18px',
                marginBottom: '10px',
                borderBottom: '1px solid #ccc',
                paddingBottom: '5px',
              }}
            >
              {cat.name}
            </h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {cat.texts.map((text) => (
                <li key={text.slug} style={{ marginBottom: '10px', marginLeft: '20px' }}>
                  <Link href={`/${cat.name}/${text.slug}`}>
                    <a style={{ textDecoration: 'none', color: '#333' }}>
                      <div
                        style={{
                          padding: '8px',
                          borderRadius: '4px',
                          backgroundColor: '#fff',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                      >
                        <h3 style={{ fontSize: '14px', margin: '0 0 4px' }}>
                          {text.title}
                        </h3>
                        <p
                          style={{
                            fontSize: '12px',
                            margin: '0 0 4px',
                            color: '#666',
                          }}
                        >
                          {text.date} • {text.author}
                        </p>
                        <p style={{ fontSize: '12px', margin: 0, color: '#444' }}>
                          {text.preview}
                        </p>
                      </div>
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
