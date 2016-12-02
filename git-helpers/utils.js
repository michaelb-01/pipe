if (typeof Meteor !== 'undefined') return;

var ChildProcess = require('child_process');
var Fs = require('fs');
var Paths = require('./paths');


// Get the recent commit by the provided arguments. An offset can be specified which
// means that the recent commit from several times back can be fetched as well
function getRecentCommit(offset, args) {
  if (offset instanceof Array) {
    args = offset;
    offset = 0;
  }
  else {
    args = args || [];
    offset = offset || 0;
  }

  args = ['log', 'HEAD~' + offset, '--max-count=1'].concat(args);
  return git(args);
}

// Launch git and print result to terminal
function gitPrint(args, env) {
  return execPrint('git', args, env);
}

// Launch git
function git(args, env) {
  return exec('git', args, env);
}

// Spawn new process and print result to the terminal
function execPrint(file, args, env) {
  if (!(args instanceof Array)) {
    env = args;
    args = [];
  }

  env = env || {};
  env = extend({}, process.env, env);

  return ChildProcess.spawnSync(file, args, { stdio: 'inherit', env: env });
}

// Execute file
function exec(file, args, env) {
  if (!(args instanceof Array)) {
    env = args;
    args = [];
  }

  env = env || {};
  env = extend({}, process.env, env);

  return ChildProcess.execFileSync(file, args, { env: env }).toString();
}

// Find an element in an array by a provided test function
function find(arr, test, defaultValue) {
  var result;

  arr.some(function (el) {
    if (test.apply(null, arguments)) {
      result = el;
      return true;
    }
  });

  return result == null ? defaultValue : result;
}

// Extend destination object with provided sources
function extend(destination) {
  var sources = [].slice.call(arguments, 1);

  sources.forEach(function (source) {
    Object.keys(source).forEach(function (k) {
      destination[k] = source[k];
    });
  });

  return destination;
}


git.print = gitPrint;
exec.print = execPrint;

module.exports = {
  recentCommit: getRecentCommit,
  git: git,
  exec: exec,
  find: find,
  extend: extend
};