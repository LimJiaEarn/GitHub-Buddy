"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { GitHubFile } from "@/types/github";
import {
  decodeBase64Content,
  getFileExtension,
  isBinaryContent,
} from "@/utils/formURLs";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

interface FileViewerProps {
  file: GitHubFile | null;
  isLoading?: boolean;
}

// Import the built-in themes to extend them
import {
  atomDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import type { CSSProperties } from "react";

// Custom high-tech light theme based on our design system
const techLight: { [key: string]: CSSProperties } = {
  ...oneLight,
  'code[class*="language-"]': {
    ...oneLight['code[class*="language-"]'],
    color: "hsl(215, 30%, 12%)",
    background: "hsl(210, 30%, 99%)",
    textShadow: "none",
    fontFamily:
      'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
    fontSize: "14px",
  },
  'pre[class*="language-"]': {
    ...oneLight['pre[class*="language-"]'],
    color: "hsl(215, 30%, 12%)",
    background: "hsl(210, 30%, 99%)",
    textShadow: "none",
    fontFamily:
      'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
    fontSize: "14px",
    padding: "1em",
    margin: "0.5em 0",
    overflow: "auto",
    borderRadius: "0.3em",
  },
  comment: {
    color: "hsl(215, 25%, 40%)",
    fontStyle: "italic",
  },
  prolog: {
    color: "hsl(215, 25%, 40%)",
  },
  doctype: {
    color: "hsl(215, 25%, 40%)",
  },
  cdata: {
    color: "hsl(215, 25%, 40%)",
  },
  punctuation: {
    color: "hsl(215, 30%, 30%)",
  },
  property: {
    color: "hsl(220, 70%, 45%)",
  },
  tag: {
    color: "hsl(355, 65%, 50%)",
  },
  boolean: {
    color: "hsl(320, 65%, 50%)",
  },
  number: {
    color: "hsl(30, 80%, 50%)",
  },
  constant: {
    color: "hsl(320, 65%, 50%)",
  },
  symbol: {
    color: "hsl(199, 82%, 45%)",
  },
  selector: {
    color: "hsl(130, 60%, 40%)",
  },
  "attr-name": {
    color: "hsl(40, 80%, 45%)",
  },
  string: {
    color: "hsl(130, 60%, 40%)",
  },
  char: {
    color: "hsl(130, 60%, 40%)",
  },
  builtin: {
    color: "hsl(270, 60%, 60%)",
  },
  inserted: {
    color: "hsl(130, 60%, 40%)",
  },
  operator: {
    color: "hsl(215, 30%, 30%)",
  },
  entity: {
    color: "hsl(199, 82%, 45%)",
    cursor: "help",
  },
  url: {
    color: "hsl(199, 82%, 45%)",
  },
  variable: {
    color: "hsl(355, 65%, 50%)",
  },
  atrule: {
    color: "hsl(270, 60%, 60%)",
  },
  "attr-value": {
    color: "hsl(130, 60%, 40%)",
  },
  keyword: {
    color: "hsl(270, 60%, 60%)",
  },
  function: {
    color: "hsl(199, 82%, 45%)",
  },
  regex: {
    color: "hsl(199, 82%, 60%)",
  },
  important: {
    color: "hsl(355, 65%, 50%)",
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  deleted: {
    color: "hsl(355, 65%, 50%)",
  },
};

// Custom high-tech dark theme based on our design system
const techDark: { [key: string]: CSSProperties } = {
  ...atomDark,
  'code[class*="language-"]': {
    ...atomDark['code[class*="language-"]'],
    color: "hsl(210, 20%, 90%)",
    background: "hsl(230, 25%, 10%)",
    textShadow: "none",
    fontFamily:
      'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
    fontSize: "14px",
  },
  'pre[class*="language-"]': {
    ...atomDark['pre[class*="language-"]'],
    color: "hsl(210, 20%, 90%)",
    background: "hsl(230, 25%, 10%)",
    textShadow: "none",
    fontFamily:
      'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
    fontSize: "14px",
  },
  comment: {
    color: "hsl(210, 20%, 60%)",
    fontStyle: "italic",
  },
  prolog: {
    color: "hsl(210, 20%, 60%)",
  },
  doctype: {
    color: "hsl(210, 20%, 60%)",
  },
  cdata: {
    color: "hsl(210, 20%, 60%)",
  },
  punctuation: {
    color: "hsl(210, 20%, 70%)",
  },
  property: {
    color: "hsl(199, 90%, 70%)",
  },
  tag: {
    color: "hsl(355, 75%, 60%)",
  },
  boolean: {
    color: "hsl(320, 75%, 65%)",
  },
  number: {
    color: "hsl(35, 80%, 60%)",
  },
  constant: {
    color: "hsl(320, 75%, 65%)",
  },
  symbol: {
    color: "hsl(199, 90%, 70%)",
  },
  selector: {
    color: "hsl(160, 75%, 60%)",
  },
  "attr-name": {
    color: "hsl(40, 80%, 60%)",
  },
  string: {
    color: "hsl(160, 75%, 60%)",
  },
  char: {
    color: "hsl(160, 75%, 60%)",
  },
  builtin: {
    color: "hsl(275, 80%, 70%)",
  },
  inserted: {
    color: "hsl(160, 75%, 60%)",
  },
  operator: {
    color: "hsl(210, 20%, 80%)",
  },
  entity: {
    color: "hsl(199, 90%, 70%)",
    cursor: "help",
  },
  url: {
    color: "hsl(199, 90%, 70%)",
  },
  variable: {
    color: "hsl(355, 75%, 60%)",
  },
  atrule: {
    color: "hsl(275, 80%, 70%)",
  },
  "attr-value": {
    color: "hsl(160, 75%, 60%)",
  },
  keyword: {
    color: "hsl(275, 80%, 70%)",
  },
  function: {
    color: "hsl(199, 90%, 70%)",
  },
  regex: {
    color: "hsl(199, 90%, 70%)",
  },
  important: {
    color: "hsl(355, 75%, 60%)",
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  deleted: {
    color: "hsl(355, 75%, 60%)",
  },
};

export function FileViewer({ file, isLoading = false }: FileViewerProps) {
  const [content, setContent] = useState<string>("");
  const [language, setLanguage] = useState<string>("text");

  const { theme } = useTheme();

  useEffect(() => {
    if (file && file.content) {
      const decodedContent = decodeBase64Content(file.content);
      setContent(decodedContent);
      // Determine language based on file extension
      const ext = getFileExtension(file.name);
      const langMap: { [key: string]: string } = {
        js: "javascript",
        jsx: "jsx",
        ts: "typescript",
        tsx: "tsx",
        py: "python",
        java: "java",
        html: "html",
        css: "css",
        json: "json",
        md: "markdown",
        yml: "yaml",
        yaml: "yaml",
        // Additional mappings for better language support
        sh: "bash",
        bash: "bash",
        c: "c",
        cpp: "cpp",
        h: "c",
        hpp: "cpp",
        cs: "csharp",
        rb: "ruby",
        rs: "rust",
        go: "go",
        php: "php",
        sql: "sql",
        swift: "swift",
        kt: "kotlin",
        dart: "dart",
        vue: "markup",
      };
      setLanguage(langMap[ext] || "text");
    }
  }, [file]);

  if (isLoading) {
    return (
      <div className="h-full">
        <div className="p-4">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="h-full">
        <div className="p-4">
          <p className="text-muted-foreground text-center">No file selected</p>
        </div>
      </div>
    );
  }

  // If binary content, show a message instead
  if (file.content && isBinaryContent(decodeBase64Content(file.content))) {
    return (
      <div className="h-full">
        <div className="p-4">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">{file.name}</h2>
            <p className="text-muted-foreground">
              Binary file content cannot be displayed
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {file.content ? (
        <div className="overflow-hidden rounded-md border">
          <SyntaxHighlighter
            language={language}
            style={theme === "dark" ? techDark : techLight}
            showLineNumbers
            wrapLines
            customStyle={{
              margin: 0,
              borderRadius: "0.375rem",
              fontSize: 13,
              boxShadow:
                theme === "dark"
                  ? "0 0 10px rgba(152, 235, 251, 0.05)"
                  : "0 0 10px rgba(152, 235, 251, 0.02)",
            }}
            lineNumberStyle={{
              minWidth: "2.5em",
              paddingRight: "1em",
              textAlign: "right",
              userSelect: "none",
            }}
          >
            {content}
          </SyntaxHighlighter>
        </div>
      ) : (
        <p className="text-muted-foreground">No content available</p>
      )}
    </div>
  );
}

export default FileViewer;
