#!/bin/bash

DOMAIN=${1:-localhost}
BASE_DIR=$(dirname "$(realpath "$0")")
if [[ ! -f "../files/${DOMAIN}.crt" ]]; then
    $BASE_DIR/create-rootCA.sh
    $BASE_DIR/create-certs.sh $DOMAIN
fi
