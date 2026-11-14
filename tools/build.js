/* Construit dist/AeroEnglish.html : un fichier unique (CSS + JS intégrés) facile à copier sur clé USB / téléphone.
   Usage : node tools/build.js */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (m, f) => '<style>\n' + fs.readFileSync(path.join(root, f), 'utf8') + '\n</style>');
html = html.replace(/<script src="([^"]+)"><\/script>/g, (m, f) => '<script>\n' + fs.readFileSync(path.join(root, f), 'utf8').replace(/<\/script>/gi, '<\\/script>') + '\n</script>');
const icon = 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(root, 'icons/icon.svg')).toString('base64');
html = html.replace(/<link rel="manifest"[^>]*>\n?/, '').replace(/href="icons\/icon.svg"/g, `href="${icon}"`);
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'AeroEnglish.html'), html);
console.log('dist/AeroEnglish.html', Math.round(html.length / 1024) + ' Ko');
