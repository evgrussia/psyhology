'use client';

import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';

export function MarkdownEditor(props: {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
}) {
  return (
    <CodeMirror
      value={props.value}
      height={`${props.minHeight ?? 260}px`}
      extensions={[markdown(), EditorView.lineWrapping]}
      onChange={(value) => props.onChange(value)}
    />
  );
}

