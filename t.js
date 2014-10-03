var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
  //console.log(filename);
  return filename.indexOf('node_modules') === -1;
});

require('./test');
