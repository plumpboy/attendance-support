#!/bin/bash
BASE_DIR=$(dirname "$(realpath "$0")")
PARENT_DIR=$(dirname "$BASE_DIR")
# Create CA key and cert
openssl genrsa -out $PARENT_DIR/files/rootCA.key 2048
openssl req -subj "/C=VN/ST=Hanoi/L=Hanoi/O=MyCompany/OU=Division/emailAddress=admin@example.com/CN=Localhost Certification Authority" \
    -x509 -new -nodes -key $PARENT_DIR/files/rootCA.key -sha256 -days 1024 -out $PARENT_DIR/files/rootCA.pem
