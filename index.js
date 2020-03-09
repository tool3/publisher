const core = require('@actions/core');
const { exec } = require('@actions/exec');

async function run() {
  try {
    const scope = core.getInput('scope');

    const registries = {
      github: {
        url: 'npm.pkg.github.com',
        token: core.getInput('github_token')
      },
      npm: {
        url: 'registry.npmjs.org',
        token: core.getInput('npm_token')
      }
    };

    core.info(`using scope: ${scope}`);

    await Object.keys(registries).reduce(async (promise, registry) => {
      const { url, token } = registries[registry];
      await promise;

      core.startGroup(`Publishing to ${registry}`);

      await exec('echo', [`'//${url}/:_authToken=${token}'`, '>', '~/.npmrc']);
      await exec('npm', ['publish']);
      core.info(`Successfully published to ${registry} !`);

      core.endGroup(`Publishing to ${registry}`)
    }, Promise.resolve());

  } catch (error) {
    core.setFailed(`Failed to publish ${error.message}`);
  }
}

run();