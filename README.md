# Publisher Action 
simple npm and github packages publish

# Create an action from this template
Click the `Use this Template` and provide the new repo details for your action

# Usage
using `publisher` is easy, all you do is add the relevant publish step in your action, or set it up as a standalone action.   
an example step would be:   
```yaml
- uses: tool3/publisher@v1
  with:
    npm_token: ${{secrets.NPM_TOKEN}}
    github_token: ${{secrets.GP_TOKEN}}
    scope: "@tool3"
```

# Options
* `github_token`
   **required**
   Github access token
* `npm_token`
  **required**
  Npm private token
* `scope`
  user scope for package

# Example
Example of an automated release pipeline.   

```yaml
name: release

on:
  push:
    branches:
      - release

jobs:
  tag:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: tool3/bump@master
        with:
          github_token: ${{ secrets.GP_TOKEN }}
          unrelated: true

  publish:
    needs: tag
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: tool3/publisher@v1
        with:
          npm_token: ${{secrets.NPM_TOKEN}}
          github_token: ${{secrets.GP_TOKEN}}
          scope: "@tool3"
```