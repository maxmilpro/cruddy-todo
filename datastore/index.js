const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id ) => {
    fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
      callback(null, {id, text});
    });
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    var data = _.map(files, (fileName) => {
      return new Promise(function(resolve, reject) {
        fs.readFile(path.join(exports.dataDir, fileName), function(err, text) {
          resolve({id: fileName.slice(0, 5), text: text.toString()});
        });
      });
    });
    Promise.all(data).then((todos) => {
      callback(null, todos);
    });
  });
};

exports.readOne = (id, callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    var file = _.find(files, function(fileName) { return fileName.slice(0, 5) === id; });
    if (!file) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.readFile(path.join(exports.dataDir, file), function(err, text) {
        callback(null, {id, text: text.toString()});
      });
    }
  });


};

exports.update = (id, text, callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    var file = _.find(files, function(fileName) { return fileName.slice(0, 5) === id; });
    if (!file) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
        callback(null, {id, text});
      });
    }
  });
};

exports.delete = (id, callback) => {

  fs.readdir(exports.dataDir, (err, files) => {
    var file = _.find(files, function(fileName) { return fileName.slice(0, 5) === id; });
    if (!file) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(path.join(exports.dataDir, id + '.txt'), err => {
        callback();
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
