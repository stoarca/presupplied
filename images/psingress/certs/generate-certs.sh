openssl req -x509 -nodes -days 3650 -newkey rsa:2048 -keyout ./selfsigned.key -out ./selfsigned.crt -subj /CN=*.presupplied.com
