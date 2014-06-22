flit-contrib-flightplan
===============

> [Flightplan](https://github.com/pstadler/flightplan) plugin for using flightplan for streamlining application deployment or systems administration tasks.

## Getting Started
Install plugin with this command:

```shell
npm install flit-contrib-flightplan --save-dev
```

Once the plugin has been installed, it may be enabled inside your flitfile with this line of JavaScript:

```js
flit.loadNpmPlugin('flit-contrib-flightplan');
```

Or using [load-flit-plugins](https://github.com/taoyuan/load-flit-plugins) to auto load all plugins included in `package.json`.

## Sample `flitfile.js`

```js


module.exports = function (flit) {
  require('load-flit-plugins')(flit);

  var tmpDir = 'sample-com-' + new Date().getTime();

  flit.init({
    debug: false,
    destinations: {
      'staging': {
        host: 'staging.sample.com',
        username: 'sample',
        agent: process.env.SSH_AUTH_SOCK
      },
      'production': [
        {
          host: 'www1.sample.com',
          username: 'sample',
          agent: process.env.SSH_AUTH_SOCK
        },
        {
          host: 'www2.sample.com',
          username: 'sample',
          agent: process.env.SSH_AUTH_SOCK
        }
      ]
    }
  });

  // `c` is the context object.
  // The flit-contrib-flightplan plugin extended the context object with two function: `local` and `remote`.
  // More about local and remote usage to visit: https://github.com/pstadler/flightplan
  flit.task(function (c) {
    // run commands on localhost
    c.local(function(local) {
      local.log('Run build');
      local.exec('gulp build');

      local.log('Copy files to remote hosts');
      var filesToCopy = local.exec('git ls-files', {silent: true});
      // rsync files to all the destination's hosts
      local.transfer(filesToCopy, '/tmp/' + tmpDir);
    });

    // run commands on remote hosts (destinations)
    c.remote(function(remote) {
      remote.log('Move folder to web root');
      remote.sudo('cp -R /tmp/' + tmpDir + ' ~', {user: 'www'});
      remote.rm('-rf /tmp/' + tmpDir);

      remote.log('Install dependencies');
      remote.sudo('npm --production --prefix ~/' + tmpDir
                                + ' install ~/' + tmpDir, {user: 'www'});

      remote.log('Reload application');
      remote.sudo('ln -snf ~/' + tmpDir + ' ~/sample-sh', {user: 'www'});
      remote.sudo('pm2 reload sample-sh', {user: 'www'});
    });

    // run more commands on localhost afterwards
    c.local(function(local) { /* ... */ });
    // ...or on remote hosts
    c.remote(function(remote) { /* ... */ });
  });
});
```
