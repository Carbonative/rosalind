require('shelljs/global');

cd(__dirname);
cd('../../..');
exec([
  'VELOCITY_CI=1',
  'meteor',
  '--test',
  '--settings ../environments/test/settings.json',
  '--release velocity:METEOR@1.1.0.3_1'
].join(' '));
