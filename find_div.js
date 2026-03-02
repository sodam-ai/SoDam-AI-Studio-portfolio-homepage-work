const fs = require('fs');
const content = fs.readFileSync('src/components/features/admin/AdminProjectForm.tsx', 'utf8');

let depth = 0;
// Strip comments and strings out safely, then count
const cleanContent = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

const lines = cleanContent.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const openMatch = line.match(/<div/g);
  const closeMatch = line.match(/<\/div>/g);
  if (openMatch) depth += openMatch.length;
  if (closeMatch) depth -= closeMatch.length;
  // If depth is deeply nested, let's print
  if (depth < 0) {
    console.log('Negative depth at line ' + (i) + '! ' + line);
    depth = 0;
  }
}
console.log('Final depth: ' + depth);
