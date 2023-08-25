import dynamic from 'next/dynamic';
import '@uiw/react-markdown-preview/markdown.css';

const MarkdownEditor = dynamic(
  () => import('@uiw/react-markdown-editor').then((mod) => mod.default),
  { ssr: false }
);

const MarkdownPreviewer = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const TextEditor = ({ value, onChange }: Props) => {
  document.documentElement.setAttribute('data-color-mode', 'light');
  return (
    <div className="my-4">
      <MarkdownEditor
        theme="light"
        minHeight="500px"
        value={value}
        onChange={(value, viewUpdate) => onChange(value)}
      />
    </div>
  );
};

export const MarkdownPreview = ({ content }: { content: string }) => {
  return (
    <MarkdownPreviewer
      wrapperElement={{
        'data-color-mode': 'light',
      }}
      source={content}
    />
  );
};
