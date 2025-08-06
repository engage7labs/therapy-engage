const fs = require('fs');
const path = require('path');

// Mapeamento de ícones Phosphor para Lucide
const iconMap = {
  'SignOut': 'LogOut',
  'AlertTriangle': 'AlertTriangle',
  'Volume': 'Volume2',
  'VolumeX': 'VolumeX',
  'BellOff': 'BellOff',
  'Settings': 'Settings',
  'MessageCircle': 'MessageCircle',
  'Save': 'Save',
  'Edit': 'Edit2',
  'RotateCcw': 'RotateCcw',
  'Send': 'Send',
  'Activity': 'Activity',
  'AlertCircle': 'AlertCircle',
  'Minimize': 'Minimize2',
  'VideoOff': 'VideoOff',
  'MoreHorizontal': 'MoreHorizontal',
  'ChevronRight': 'ChevronRight',
  'VideoSlash': 'VideoOff',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Substituir imports do Phosphor por Lucide
  if (content.includes('@phosphor-icons/react')) {
    content = content.replace(/@phosphor-icons\/react/g, 'lucide-react');
    modified = true;
  }

  // Corrigir nomes dos ícones
  for (const [oldName, newName] of Object.entries(iconMap)) {
    if (content.includes(oldName)) {
      // Regex para substituir apenas o nome do ícone (não em strings ou comentários)
      const regex = new RegExp(`\\b${oldName}\\b(?!['\"]|\\s*:)`, 'g');
      content = content.replace(regex, newName);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Fixed: ${filePath}`);
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
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      try {
        processFile(filePath);
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
      }
    }
  });
}

console.log('��� Fixing icon imports...\n');
walkDir('./app');
walkDir('./components');
console.log('\n✅ Done!');
