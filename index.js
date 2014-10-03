var traceur = require('traceur');

function isModuleFiles (filename) {
  return filename.indexOf('node_modules') == -1;
}

traceur.require.makeDefault(isModuleFiles);
require('./test');
