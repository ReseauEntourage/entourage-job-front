// typescript-eslint does not support TypeScript 7 yet (peer range <6.1.0).
// Make it resolve the TypeScript 6 API from @typescript/typescript6 instead
// of the project's `typescript` (v7), until it supports TS >= 7.1.
// Tracking: https://github.com/typescript-eslint/typescript-eslint/issues/10940
const TS6 = 'npm:@typescript/typescript6@^6.0.2';

module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.name && pkg.name.startsWith('@typescript-eslint/')) {
        if (pkg.peerDependencies && pkg.peerDependencies.typescript) {
          delete pkg.peerDependencies.typescript;
        }
        if (pkg.peerDependenciesMeta) delete pkg.peerDependenciesMeta.typescript;
        pkg.dependencies = { ...pkg.dependencies, typescript: TS6 };
      }
      return pkg;
    },
  },
};
