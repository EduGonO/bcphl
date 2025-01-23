import fs from 'fs';
import path from 'path';
import { GetStaticPaths, GetStaticProps } from 'next';

const ArticlePage = ({ title, content }: { title: string; content: string }) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const categoriesDir = path.join(process.cwd(), 'text');
  const paths: { params: { category: string; slug: string } }[] = [];

  fs.readdirSync(categoriesDir).forEach((category) => {
    const categoryPath = path.join(categoriesDir, category);
    if (fs.lstatSync(categoryPath).isDirectory()) {
      fs.readdirSync(categoryPath).forEach((file) => {
        if (file.endsWith('.md')) {
          const slug = file.replace('.md', '').toLowerCase().replace(/\s+/g, '-');
          paths.push({ params: { category, slug } });
        }
      });
    }
  });

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { category, slug } = params as { category: string; slug: string };
  const filePath = path.join(process.cwd(), 'text', category, `${slug.replace(/-/g, ' ')}.md`);

  const fileContents = fs.readFileSync(filePath, 'utf-8').trim();
  const lines = fileContents.split('\n').map((line) => line.trim());
  const title = lines[0].startsWith('#') ? lines[0].replace(/^#+\s*/, '') : slug.replace(/-/g, ' ');
  const content = lines.slice(3).join('\n');

  return {
    props: {
      title,
      content,
    },
  };
};

export default ArticlePage;