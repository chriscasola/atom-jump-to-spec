'use babel';

import { CompositeDisposable, File } from 'atom';

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
      this.getSpecFilePath(editor);
    }
  },

  getSpecFilePath(editor) {
    const srcPath = atom.project.relativizePath(editor.getPath());
    ['/test/unit', '/spec', '/test', '/src'].forEach(testDir => {
      ['.spec', '-spec'].forEach(testPostfix => {
        let specPath = srcPath[0] + testDir + srcPath[1].slice(3);
        const indexOfExtension = specPath.lastIndexOf('.');
        specPath = specPath.slice(0, indexOfExtension) + testPostfix + specPath.slice(indexOfExtension);
        const testFile = new File(specPath);
        testFile.exists().then(doesExist => {
          if (doesExist) {
            atom.workspace.open(specPath);
          }
        });
      });
    });
  },
};
