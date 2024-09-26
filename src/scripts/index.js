import '../styles/fonts.css';
import '../styles/globals.css';
import '../styles/variables.css';
import '../styles/dark.css';
import '../styles/light.css';

import './script.js';

// Динамический импорт CSS-файлов из блоков
function importAll(r) {
  r.keys().forEach(r);
}

importAll(require.context('../blocks/', true, /\.css$/));
