import React from 'react';

interface GeminiNotebookNameProps {
  className?: string;
}

export default function GeminiNotebookName({ className }: GeminiNotebookNameProps) {
  return (
    <span className={className}>
      Gemini Notebook{' '}
      <span className="text-[#EF4444] line-through decoration-2 decoration-[#EF4444]">LM</span>
    </span>
  );
}
