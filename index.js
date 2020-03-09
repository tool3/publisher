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

    Object.keys(registries).forEach(async registry => {
      core.group(registry);
      const { url, token } = registries[registry];
      core.info('', `Publishing to ${registry}...`);
      await exec('npm', ['publish', `--registry=https://${url}/:_authToken=${token}`]);
      core.info(`Successfully published to ${registry} !`);
    });

  } catch (error) {
    core.setFailed(`Failed to publish ${error.message}`);
  }
}

run();