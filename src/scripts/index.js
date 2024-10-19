import '../styles/fonts.scss';
import '../styles/variables.scss';
import '../styles/globals.scss';

// Динамический импорт CSS-файлов из блоков
function importAll(r) {
  r.keys().forEach(r);
}

importAll(require.context('../blocks/', true, /\.s[ac]ss$/i));

import '../styles/dark.scss';
import '../styles/light.scss';

import './script.js';
