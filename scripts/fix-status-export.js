const fs = require('fs');
const path = require('path');

const exportDir = path.join(process.cwd(), 'site', 'status-page', '__sapper__', 'export');

const TEXT_EXTENSIONS = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.map',
  '.svg',
  '.txt',
  '.webmanifest',
  '.xml',
]);

const replacements = [
  [/https?:\/\/status\.aclclouds\.com\/themes\//g, '/themes/'],
  [/https?:\/\/status\.aclclouds\.com\/global\.css/g, '/global.css'],
  [/path:"https:\/\/status\.aclclouds\.com"/g, 'path:""'],
  [/path:'https:\/\/status\.aclclouds\.com'/g, "path:''"],
  [/"path":"https:\/\/status\.aclclouds\.com"/g, '"path":""'],
  [
    /https:\/\/raw\.githubusercontent\.com\/upptime\/upptime\/master\/assets\/upptime-icon\.svg/g,
    '/logo-192.png',
  ],
  [/https:\/\/icons\.duckduckgo\.com\/ip3\/[^"'`<>)\s]+?\.ico/g, '/logo-192.png'],
];

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (entry.isFile() && TEXT_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

if (!fs.existsSync(exportDir)) {
  throw new Error(`Upptime export directory not found: ${exportDir}`);
}

let changedFiles = 0;
let replacementsCount = 0;

for (const file of walk(exportDir)) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before;

  for (const [pattern, value] of replacements) {
    after = after.replace(pattern, (...match) => {
      replacementsCount += 1;
      return value;
    });
  }

  if (after !== before) {
    fs.writeFileSync(file, after);
    changedFiles += 1;
  }
}

console.log(`Fixed generated status assets: ${changedFiles} files, ${replacementsCount} replacements.`);
