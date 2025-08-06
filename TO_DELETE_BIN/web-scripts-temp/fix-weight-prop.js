const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remover propriedade weight dos componentes de Ã­cone
  const weightRegex = /weight=\{[^}]*\}|weight="[^"]*"/g;
  if (weightRegex.test(content)) {
    content = content.replace(weightRegex, '');
    modified = true;
  }

  // Limpar espaÃ§os extras que podem ter ficado
  content = content.replace(/\s+\/>/g, ' />');
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`âœ“ Fixed weight props in: ${filePath}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDir(filePath);
    } else if (file.endsWith('.tsx')) {
      try {
        processFile(filePath);
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
      }
    }
  });
}

console.log('í´§ Removing weight props from icons...\n');
walkDir('./app');
walkDir('./components');
console.log('\nâœ… Done!');
