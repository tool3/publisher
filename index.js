const core = require('@actions/core');
const { exec } = require('@actions/exec');
const { Toolkit } = require('actions-toolkit');

Toolkit.run(async tools => {
  {
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

        core.group(registry);
        const { url, token } = registries[registry];
        tools.log(`Publishing to ${registry}...`);

        try {
          await exec('npm', ['publish', `--registry=https://${url}/:_authToken=${token}`]);
          tools.log(`Successfully published to ${registry} !`);
        } catch (error) {
          Promise.reject(error);
        }

      }, Promise.resolve());

    } catch (error) {
      core.error(error);
      core.setFailed(`Failed to publish ${error.message}`);
    }
  }
});


