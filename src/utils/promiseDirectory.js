/* eslint-disable */

let fs = require('fs'),
  path = require('path');


function readDirRecursive(startDir) {
  let readDirQueue = [],
    fileList = [];

  function readDir(dir) {
    function getItemList(readDir) {
      return new Promise((resolve, reject) => {
        fs.readdir(readDir, (err, itemList) => {
          if (err) {
            return reject();
          }

          // resolve with parent path added to each item
          resolve(itemList.map(item => path.resolve(readDir, item)));
        });
      });
    }

    function getItemListStat(itemList) {
      function getStat(itemPath) {
        return new Promise((resolve, reject) => {
          fs.stat(itemPath, (err, stat) => {
            if (err) {
              return reject();
            }

            // resolve with item path and if directory
            resolve({ itemPath, isDirectory: stat.isDirectory() });
          });
        });
      }

      // stat all items in list
      return Promise.all(itemList.map(getStat));
    }

    function processItemList(itemList) {
      for (const { itemPath, isDirectory } of itemList) {
        // if directory add to queue
        if (isDirectory) {
          readDirQueue.push(itemPath);
          continue;
        }

        // add file to list
        fileList.push(itemPath);
      }

      // if queue, process next item recursive
      if (readDirQueue.length > 0) {
        return readDir(readDirQueue.shift());
      }

      // finished - return file list
      return fileList;
    }

    // read item list from directory, stat each item then walk result
    return getItemList(dir)
      .then(getItemListStat)
      .then(processItemList);
  }

  // commence reading at the top
  return readDir(startDir);
}

readDirRecursive('/Users/drewroyster/Documents/classes').then((itemList) => {
  console.log(itemList);
});
