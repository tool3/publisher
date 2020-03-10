const core = require('@actions/core');
const { exec } = require('@actions/exec');
const fs = require('fs');
const os = require('os');
const util = require('util');
const write = util.promisify(fs.writeFile);

async function run() {
  try {
    let scope = core.getInput('scope');
    let sanitizedScope = scope && (scope.includes('@') ? scope : `@${scope}`)
    const npmrc = `${os.homedir()}/.npmrc`
    const packageJson = require(`${process.cwd()}/package.json`);
    const packageName = packageJson.name;
    const scopedPackage = packageName.includes('@');

    const registries = {
      github: {
        url: `npm.pkg.github.com`,
        token: core.getInput('github_token')
      },
      npm: {
        url: 'registry.npmjs.org',
        token: core.getInput('npm_token')
      }
    };

    if (scopedPackage) {
      sanitizedScope = packageName.split('/')[0];
    }

    core.info(`using scope: ${scope}`);

    await Object.keys(registries).reduce(async (promise, registry) => {
      const { url, token } = registries[registry];
      await promise;
      core.startGroup(`Publishing to ${registry}`);

      // create a local .npmrc file
      await write(npmrc, `//${url}/:_authToken=${token}\n${sanitizedScope}:registry=https://${url}`);

      // get latest tags
      await exec('git', ['pull', 'origin', 'master', '--tags']);

      // configure npm and publish
      const publishArgs = ['publish', `--registry=https://${url}`];

      if (scopedPackage) {
        publishArgs.pusg(`--scope=${sanitizedScope}`);
      }

      await exec('npm', publishArgs);

      core.info(`Successfully published to ${registry} !`);
      core.endGroup(`Publishing to ${registry}`)

    }, Promise.resolve());

  } catch (error) {
    core.setFailed(`Failed to publish ${error.message}`);
  }
}

run();
