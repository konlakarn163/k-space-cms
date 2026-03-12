'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TipImage from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link2,
  ImagePlus,
  Quote,
  Minus,
} from 'lucide-react';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>;
};

const ToolBtn = ({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={[
      'rounded-md px-2 py-1 text-xs transition-colors',
      active ? 'bg-(--accent) text-white' : 'theme-secondary-button',
    ].join(' ')}
  >
    {children}
  </button>
);

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your story...',
  onImageUpload,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      TipImage.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: [
          'theme-input min-h-52 rounded-b-xl rounded-t-none px-4 py-3 text-sm outline-none',
          'prose prose-sm max-w-none dark:prose-invert',
          'prose-a:text-[var(--accent)] prose-a:underline',
          'prose-img:rounded-lg prose-img:max-w-full',
          'prose-headings:font-bold',
          'prose-code:bg-[var(--canvas-subtle)] prose-code:rounded prose-code:px-1',
          'prose-blockquote:border-l-4 prose-blockquote:border-[var(--border)] prose-blockquote:pl-4',
        ].join(' '),
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Enter URL', prev ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  };

  const handleImageFile = async (file: File) => {
    if (!onImageUpload || !editor) return;
    try {
      const url = await onImageUpload(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Image upload failed');
    }
  };

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-(--border)">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-1 border-b border-(--border) bg-(--canvas-subtle) px-2 py-1.5">
        {/* Headings */}
        <ToolBtn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2"><Heading2 className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3"><Heading3 className="h-3.5 w-3.5" /></ToolBtn>

        <div className="mx-1 h-4 w-px bg-(--border)" />

        {/* Inline marks */}
        <ToolBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><Bold className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><Italic className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough"><Strikethrough className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()} title="Inline code"><Code className="h-3.5 w-3.5" /></ToolBtn>

        <div className="mx-1 h-4 w-px bg-(--border)" />

        {/* Blocks */}
        <ToolBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list"><List className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered list"><ListOrdered className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote"><Quote className="h-3.5 w-3.5" /></ToolBtn>
        <ToolBtn active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus className="h-3.5 w-3.5" /></ToolBtn>

        <div className="mx-1 h-4 w-px bg-(--border)" />

        {/* Media */}
        <ToolBtn active={editor.isActive('link')} onClick={setLink} title="Add link"><Link2 className="h-3.5 w-3.5" /></ToolBtn>
        {onImageUpload ? (
          <ToolBtn active={false} onClick={() => fileInputRef.current?.click()} title="Insert image"><ImagePlus className="h-3.5 w-3.5" /></ToolBtn>
        ) : null}
      </div>

      {/* ── Editor area ── */}
      <EditorContent editor={editor} />

      {onImageUpload ? (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              await handleImageFile(file);
              e.target.value = '';
            }
          }}
        />
      ) : null}
    </div>
  );
}
