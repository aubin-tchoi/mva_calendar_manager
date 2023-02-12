#!/bin/bash

pushd src
  # installing clasp to sync files with google apps script
  npm install @google/clasp -g
  # you gotta login using your browser here
  clasp login
  wait
  # pressing ENTER after the clasp create command to create a standalone script
  echo | clasp create
  # pushing the files in the project just created
  clasp push
  # opening the project in your favorite browser
  open https://script.google.com/home/projects/$(python -c "import sys, json; print(json.load(sys.stdin)['scriptId'])" < .clasp.json)
popd
