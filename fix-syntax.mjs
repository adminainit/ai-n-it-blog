import fs from 'fs';
let content = fs.readFileSync('src/components/BlogManager.tsx', 'utf8');

content = content.replace(
  `    savePostLocal(newDraft);
    return newDraft.id;
  };
    savePostLocal(newDraft);
    return newDraft.id;
  };`,
  `    savePostLocal(newDraft);
    return newDraft.id;
  };`
);

fs.writeFileSync('src/components/BlogManager.tsx', content);
