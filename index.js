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
      await promise;

      core.startGroup(`Publishing to ${registry}`);

      const { url, token } = registries[registry];
      
      try {
        core.exportVariable('NODE_AUTH_TOKEN', token);
        await exec('npm', ['publish', `--registry=https://${url}`]);
        core.info(`Successfully published to ${registry} !`);
      } catch (error) {
        Promise.reject(error);
      }

      core.endGroup(`Publishing to ${registry}`)
    }, Promise.resolve());

  } catch (error) {
    core.setFailed(`Failed to publish ${error.message}`);
  }
}

run();