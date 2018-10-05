/* eslint-disable */
const fs = require('fs');
const path = require('path');

var diretoryTreeToObj = function (dir, done) {
  const results = [];

  fs.readdir(dir, (err, list) => {
    if (err) { return done(err); }

    let pending = list.length;

    if (!pending) { return done(null, { name: path.basename(dir), type: 'folder', children: results }); }

    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          diretoryTreeToObj(file, (err, res) => {
            results.push({
              name: path.basename(file),
              type: 'folder',
              children: res,
            });
            if (!--pending) { done(null, results); }
          });
        } else {
          results.push({
            type: 'file',
            name: path.basename(file),
          });
          if (!--pending) { done(null, results); }
        }
      });
    });
  });
};

const dirTree = ('/Users/drewroyster/Documents/classes');

diretoryTreeToObj(dirTree, (err, res) => {
  if (err) { console.error(err); }

  console.log(JSON.stringify(res));
});
