'use babel';

import { CompositeDisposable } from 'atom';

export default {
  subscriptions: null,

  activate() {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-jump-to-spec:open-spec': () => this.openSpec(),
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  openSpec() {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor) {
      const specPath = this.getSpecFilePath(editor);
      return atom.workspace.open(specPath);
    }
  },

  getSpecFilePath(editor) {
    const srcPath = atom.project.relativizePath(editor.getPath());
    let specPath = srcPath[0] + '/spec' + srcPath[1].slice(3);
    const indexOfExtension = specPath.lastIndexOf('.');
    specPath = specPath.slice(0, indexOfExtension) + '-spec' + specPath.slice(indexOfExtension);
    return specPath;
  },
};
