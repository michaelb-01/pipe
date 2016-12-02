if (typeof Meteor !== 'undefined') return;

var Path = require('path');

/*
  It is important to use absolute paths and not relative paths since some helpers
  are distriuted over several processes whos execution path is not always the same,
  therefore this module was created.
 */

var gitHelpers = {
  _: Path.resolve('./git-helpers'),
  editor: Path.resolve('./git-helpers/editor.js'),
  step: Path.resolve('./git-helpers/step.js'),
  utils: Path.resolve('./git-helpers/utils.js')
};

var git = {
  _: Path.resolve('./.git'),
  helpers: gitHelpers
};

module.exports = {
  _: Path.resolve('.'),
  git: git
};