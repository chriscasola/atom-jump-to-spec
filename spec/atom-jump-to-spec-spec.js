'use babel';

import fs from 'fs-plus';
import temp from 'temp';
import wrench from 'wrench';
import path from 'path';

describe('AtomJumpToSpec', () => {
  let workspaceElement, rootDir, fixturesPath, activatePromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activatePromise = atom.packages.activatePackage('atom-jump-to-spec');

    waitsForPromise(() => {
      return activatePromise;
    });

    atom.commands.dispatch(workspaceElement, 'atom-jump-to-spec:toggle');

    rootDir = fs.realpathSync(temp.mkdirSync('root-dir'));
    fixturesPath = atom.project.getPaths()[0];

    wrench.copyDirSyncRecursive(
      path.join(fixturesPath, 'root-dir'),
      rootDir,
      { forceDelete: true }
    );

    atom.project.setPaths([rootDir]);

    waitsForPromise(() => {
      return atom.workspace.open(path.join(rootDir, 'src/sample.js'));
    });
  });

  describe('open spec file', () => {
    it('opens the test file corresponding to the current open file', () => {
      atom.commands.dispatch(workspaceElement, 'atom-jump-to-spec:open-spec');

      waitsFor(() => {
        return atom.workspace.getActiveTextEditor() && atom.workspace.getActiveTextEditor().getPath().indexOf('sample-spec') > -1;
      });

      runs(() => {
        expect(atom.workspace.getActiveTextEditor().getPath()).toBe(path.join(rootDir, 'spec/sample-spec.js'));
      });
    });
  });
});
