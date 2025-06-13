"use client";

interface PreviewProps {
  value: string;
}

export const Preview = ({ value }: PreviewProps) => {
  return (
    <pre className="bg-black/30 border border-purple-700/40 text-purple-200 rounded-xl p-4 whitespace-pre-wrap font-mono text-sm shadow-sm backdrop-blur-md">
      {value || "No content"}
    </pre>
  );
};