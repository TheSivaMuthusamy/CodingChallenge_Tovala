import fs from 'fs';

require.extensions['.svg'] = function (module, filename) {
   module.exports = fs.readFileSync(filename, 'utf8');
};