openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout presupplied-selfsigned.key -out presupplied-selfsigned.crt -config <(cat <<EOF
[ req ]
distinguished_name = req_distinguished_name
x509_extensions = v3_ca
prompt = no

[ req_distinguished_name ]
CN = presupplied-root-ca

[ v3_ca ]
subjectAltName = @alt_names
basicConstraints = critical,CA:TRUE
keyUsage = keyCertSign, cRLSign, digitalSignature, keyEncipherment
subjectKeyIdentifier = hash

[ alt_names ]
DNS.1 = *.presupplied.com
DNS.2 = applocal.presupplied.com
EOF
)

