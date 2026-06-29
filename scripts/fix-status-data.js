const fs = require('fs');
const path = require('path');

const logoUrl = 'https://skybots.tech/images/skybots.png';
const duckDuckGoIconPattern = /https:\/\/icons\.duckduckgo\.com\/ip3\/[^"'`<>)\s]+?\.ico/g;

const files = [
  path.join(process.cwd(), 'history', 'summary.json'),
  path.join(process.cwd(), 'README.md'),
].filter((file) => fs.existsSync(file));

let changedFiles = 0;
let replacements = 0;

for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  const after = before.replace(duckDuckGoIconPattern, () => {
    replacements += 1;
    return logoUrl;
  });

  if (after !== before) {
    fs.writeFileSync(file, after);
    changedFiles += 1;
  }
}

console.log(`Fixed generated status data: ${changedFiles} files, ${replacements} replacements.`);
