const core = require('@actions/core');
const { exec } = require('@actions/exec');
const { Toolkit } = require('actions-toolkit');

Toolkit.run(async tools => {
  {
    try {
      const scope = core.getInput('scope');

      const registries = {
        github: {
          url: 'https://npm.pkg.github.com',
          token: core.getInput('github_token')
        },
        npm: {
          url: 'https://registry.npmjs.org',
          token: core.getInput('npm_token')
        }
      };

      tools.log(`using scope: ${scope}`);

      Object.keys(registries).map(async registry => {
        const { url, token } = registries[registry];
        await exec('npm', ['publish', `--registry=${url}/:_authToken=${token}`]);
        tools.log(`Successfully published to ${registry} !`);
      });
    }
    catch (error) {
      core.setFailed(error.message);
    }
  }
});