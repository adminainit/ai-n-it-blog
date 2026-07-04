import fs from 'fs';
import path from 'path';
const dir = path.join(process.cwd(), 'src/content/posts');
console.log(fs.readdirSync(dir));
