import fs from 'fs';
let content = fs.readFileSync('src/components/PostEditor.tsx', 'utf8');

const parseFunc = `
function parseFrontmatter(rawContent) {
  if (!rawContent) return { data: {}, content: '' };
  const match = rawContent.match(/^---\\n([\\s\\S]*?)\\n---\\n([\\s\\S]*)$/);
  if (match) {
    const frontmatterRaw = match[1];
    const markdown = match[2];
    
    const data = {};
    const lines = frontmatterRaw.split('\\n');
    for (const line of lines) {
      const splitIndex = line.indexOf(':');
      if (splitIndex > -1) {
        const key = line.slice(0, splitIndex).trim();
        let value = line.slice(splitIndex + 1).trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        data[key] = value;
      }
    }
    return { data, content: markdown };
  }
  return { data: {}, content: rawContent };
}
`;

if (!content.includes('parseFrontmatter')) {
  content = content.replace("export default function PostEditor", parseFunc + "\\nexport default function PostEditor");
}

const previewCodeOld = `            {/* Preview */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-slate-900 shadow-inner">
                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-a:text-accent">
                  <ReactMarkdown>{localDraft?.content ?? ''}</ReactMarkdown>
                </div>
              </div>
            )}`;

const previewCodeNew = `            {/* Preview */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-slate-900 shadow-inner">
                {(() => {
                  const { data, content: mdContent } = parseFrontmatter(localDraft?.content ?? '');
                  return (
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-a:text-accent">
                      {data.image && (
                        <img src={data.image} alt="Hero" className="w-full h-64 object-cover rounded-xl mb-8" />
                      )}
                      {data.title && (
                        <h1 className="mb-2">{data.title}</h1>
                      )}
                      {data.description && (
                        <p className="text-xl text-slate-500 dark:text-slate-400 mt-0 mb-8">{data.description}</p>
                      )}
                      <ReactMarkdown>{mdContent}</ReactMarkdown>
                    </div>
                  );
                })()}
              </div>
            )}`;

content = content.replace(previewCodeOld, previewCodeNew);

fs.writeFileSync('src/components/PostEditor.tsx', content);
