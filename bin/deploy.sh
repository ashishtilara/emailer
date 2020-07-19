#!/usr/bin/env bash

SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

FILE="$SCRIPTPATH/environment.sh"

if [[ -f "$FILE" ]]; then
  source "$FILE" $1
fi

npx serverless deploy
