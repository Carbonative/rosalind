#!/bin/bash

set -e

if [ ! -e ../../build/bundle/package.json ]; then
  echo "** Skipping push to resin.io"
else
  echo "** Pushing bundle to resin.io"

  cd "$(dirname "$0")"

  eval "$(ssh-agent -s)"
  echo -e $RESIN_DEPLOY_KEY > id_rsa
  chmod 0600 id_rsa
  ssh-add ./id_rsa
  cat resin.id >> ~/.ssh/known_hosts

  sudo chown -R $USER ../build/bundle/

  cp ../../app/meteor/.dockerignore ../../build/bundle/
  cp Dockerfile ../../build/bundle/

  mkdir ~/resin
  mv ../../build/bundle/ ~/resin
  cd ~/resin/bundle

  git init
  git add -A .
  git commit -m "🐝 Commit ${TRAVIS_COMMIT:0:12} built by worker $TRAVIS_JOB_NUMBER"

  git remote add resin $RESIN_REMOTE
  git push --force resin master

  cd -
fi
