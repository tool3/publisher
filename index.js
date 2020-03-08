const core = require('@actions/core');
const { exec } = require('@actions/exec');
const { Toolkit } = require('actions-toolkit');

Toolkit.run(async tools => {
  {
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

    tools.log(`using scope: ${scope}`);

    Object.keys(registries).forEach(registry => {
      core.group(registry);
      const { url, token } = registries[registry];
      tools.log(`Publishing to ${registry}...`);

      exec('echo', [`//${url}/:_authToken=${token}`, '>', `.npmrc`]).then(() => {
        exec('npm', ['publish']);
      }).catch(error => {
        core.setFailed(`Failed to publish! ${error.message}`);
      });

      tools.log(`Successfully published to ${registry} !`);
    });

    core.ExitCode(0);
  }
});