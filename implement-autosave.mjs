import fs from 'fs';

let content = fs.readFileSync('src/components/PostEditor.tsx', 'utf8');

// Insert localDraft state and effects
const effectHookString = `
  const [localDraft, setLocalDraft] = useState<any>(null);

  // Sync localDraft with activeDraft when switching drafts
  useEffect(() => {
    if (activeDraft) {
      setLocalDraft({ ...activeDraft });
    }
  }, [activeDraftId, drafts.length]); // Need drafts.length in case of new draft

  // Auto-save effect
  useEffect(() => {
    if (!localDraft || !activeDraft) return;
    
    const hasChanges = localDraft.title !== activeDraft.title || 
                       localDraft.slug !== activeDraft.slug || 
                       localDraft.content !== activeDraft.content;
                       
    if (hasChanges) {
      const timer = setTimeout(() => {
        updateDraft(activeDraft.id, { 
          title: localDraft.title, 
          slug: localDraft.slug, 
          content: localDraft.content 
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [localDraft, activeDraft, updateDraft]);
`;

content = content.replace(
  "  if (!activeDraft) {\n    return (",
  effectHookString + "\n  if (!activeDraft) {\n    return ("
);

// Update handlers
content = content.replace(
  /const handleTitleChange = \(e: React.ChangeEvent<HTMLInputElement>\) => \{([\s\S]*?)\};/,
  `const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localDraft) setLocalDraft({ ...localDraft, title: e.target.value });
  };`
);

content = content.replace(
  /const handleSlugChange = \(e: React.ChangeEvent<HTMLInputElement>\) => \{([\s\S]*?)\};/,
  `const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (localDraft) setLocalDraft({ ...localDraft, slug: e.target.value });
  };`
);

content = content.replace(
  /const handleContentChange = \(e: React.ChangeEvent<HTMLTextAreaElement>\) => \{([\s\S]*?)\};/,
  `const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (localDraft) setLocalDraft({ ...localDraft, content: e.target.value });
  };`
);

content = content.replace(
  /const text = activeDraft.content;/g,
  `const text = localDraft.content || '';`
);

content = content.replace(
  /updateDraft\(activeDraft.id, \{ content: newContent \}\);/,
  `if (localDraft) setLocalDraft({ ...localDraft, content: newContent });`
);

// Update handleSavePost
content = content.replace(
  "let fileName = `${activeDraft.slug || 'new-post'}.mdx`;",
  "let fileName = `${localDraft.slug || 'new-post'}.mdx`;"
);

content = content.replace(
  "title: activeDraft.title || 'Untitled',",
  "title: localDraft.title || 'Untitled',"
);

content = content.replace(
  "rawContent: activeDraft.content",
  "rawContent: localDraft.content"
);

content = content.replace(
  "updateDraft(activeDraft.id, { title: newPost.title, content: newPost.rawContent });",
  "updateDraft(activeDraft.id, { title: newPost.title, content: newPost.rawContent });"
);

// Update inputs
content = content.replace(
  "value={activeDraft.title}",
  "value={localDraft?.title ?? ''}"
);

content = content.replace(
  "value={activeDraft.slug || ''}",
  "value={localDraft?.slug ?? ''}"
);

content = content.replace(
  "value={activeDraft.content}",
  "value={localDraft?.content ?? ''}"
);

content = content.replace(
  "<ReactMarkdown>{activeDraft.content}</ReactMarkdown>",
  "<ReactMarkdown>{localDraft?.content ?? ''}</ReactMarkdown>"
);

// Check for missing localDraft in handleFormat
content = content.replace(
  "if (!textareaRef.current) return;",
  "if (!textareaRef.current || !localDraft) return;"
);

fs.writeFileSync('src/components/PostEditor.tsx', content);
