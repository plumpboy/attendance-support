#!/bin/bash

# Create a new private key if one doesnt exist, or use the xeisting one if it does
DOMAIN=$1
NUM_OF_DAYS=999
BASE_DIR=$(dirname "$(realpath "$0")")
PARENT_DIR=$(dirname "$BASE_DIR")

openssl req -new -sha256 -nodes -out "$PARENT_DIR/files/$DOMAIN.csr" -newkey rsa:2048 -keyout "$PARENT_DIR/files/$DOMAIN.key" -config $BASE_DIR/rootCA.csr.cnf
cat $BASE_DIR/v3.ext | sed s/%%DOMAIN%%/"$DOMAIN"/g > /tmp/__v3.ext
openssl x509 -req -in "$PARENT_DIR/files/$DOMAIN.csr" -CA $PARENT_DIR/files/rootCA.pem -CAkey $PARENT_DIR/files/rootCA.key -CAcreateserial -out "$PARENT_DIR/files/$DOMAIN.crt" -days $NUM_OF_DAYS -sha256 -extfile /tmp/__v3.ext
rm /tmp/__v3.ext
