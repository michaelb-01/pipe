if (typeof Meteor !== 'undefined') return;

var Fs = require('fs');
var Minimist = require('minimist');
var Path = require('path');
var Paths = require('./paths');
var Utils = require('./utils');


var git = Utils.git;


// Automatically invoke a method by the provided arguments
(function () {
  // Disable the automatic invokation unless this is the main module of the node process
  if (require.main !== module) return;

  var argv = Minimist(process.argv.slice(2), {
    string: ['message', 'm', 'step', 's']
  });

  var method = argv._[0];
  var message = argv.message || argv.m;
  var step = argv.step || argv.s;

  switch (method) {
    case 'push': return pushStep(message);
    case 'pop': return popStep();
    case 'edit': return editStep(step);
    case 'reword': return rewordStep(step, message);
  }
})();

// Push a new step with the provided message
function pushStep(message) {
  if (message == null)
    throw TypeError('A message must be provided');

  var step = getNextStep();
  commitStep(step, message);
}

// Pop the last step
function popStep() {
  var removedCommitMessage = Utils.recentCommit(['--format=%s']);
  git.print(['reset', '--hard', 'HEAD~1']);

  var stepExists = !!getStepDescriptor(removedCommitMessage);
  if (!stepExists) return;

  console.warn('Removed commit was not a step');
}

// Edit the provided step
function editStep(step) {
  if (step == null)
    throw TypeError('A step must be provided');

  var base = getStepBase(step);

  git.print(['rebase', '-i', base], {
    GIT_SEQUENCE_EDITOR: 'node ' + Paths.git.helpers.editor + ' edit'
  });
}

// Reword the provided step with the provided message
function rewordStep(step, message) {
  if (step == null)
    throw TypeError('A step must be provided');
  if (message == null)
    throw TypeError('A message must be provided');

  var base = getStepBase(step);

  git.print(['rebase', '-i', base], {
    GIT_SEQUENCE_EDITOR: 'node ' + Paths.git.helpers.editor + ' reword --message="' + message + '"'
  });
}

// Add a new commit of the provided step with the provided message
function commitStep(step, message) {
  return git.print(['commit', '-m', 'Step ' + step + ': ' + message]);
}

// Get the current step
function getCurrentStep() {
  var recentStepCommit = getRecentStepCommit('%s');
  return getStepDescriptor(recentStepCommit).number;
}

// Get the next step
function getNextStep(offset) {
  var recentCommitHash = Utils.recentCommit(offset, ['--format=%h']);
  var recentStepHash = getRecentStepCommit(offset, '%h');
  var followedByStep = recentStepHash == recentCommitHash;

  // If not followed by a step, return the first one
  if (!followedByStep) return '0.1';

  var recentCommitMessage = Utils.recentCommit(offset, ['--format=%s']);
  var recentStepDescriptor = getStepDescriptor(recentCommitMessage);

  var superStep = recentStepDescriptor.superNumber;
  var subStep = recentStepDescriptor.subNumber + 1;

  // If no offset defined, we assume the super step remains
  if (!offset) return superStep + '.' + subStep;

  var nextStep = getNextStep(offset - 1);
  var nextSuperStep = nextStep.split('.')[0];

  // If super steps are the same, the next step is gonna be as expected
  if (superStep == nextSuperStep) return superStep + '.' + subStep;
  // Else, we assume this is the first sub step of a new step
  return nextSuperStep + '.' + 1;
}

// Get the hash of the step followed by ~1, mostly useful for a rebase
function getStepBase(step) {
  if (step == null)
    throw TypeError('A step must be provided');

  var hash = Utils.recentCommit([
    '--grep=^Step ' + step,
    '--format=%h'
  ]);

  if (!hash)
    throw Error('Step not found');

  return hash.trim() + '~1';
}

// Get recent step commit by specified arguments
function getRecentStepCommit(offset, format) {
  if (typeof offset == 'string') {
    format = offset;
    offset = 0;
  }

  var args = ['--grep=^Step [0-9]\\+\\.[0-9]\\+:'];
  if (format) args.push('--format=' + format);

  return Utils.recentCommit(offset, args);
}

// Extract step json from message
function getStepDescriptor(message) {
  if (message == null)
    throw TypeError('A message must be provided');

  var match = message.match(/^Step ((\d+)\.(\d+))\: ((?:.|\n)*)$/);

  return match && {
    number: match[1],
    superNumber: Number(match[2]),
    subNumber: Number(match[3]),
    message: match[4]
  };
}


module.exports = {
  push: pushStep,
  pop: popStep,
  edit: editStep,
  reword: rewordStep,
  commit: commitStep,
  current: getCurrentStep,
  next: getNextStep,
  base: getStepBase,
  recentStepCommit: getRecentStepCommit,
  descriptor: getStepDescriptor
};