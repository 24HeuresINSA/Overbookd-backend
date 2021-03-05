#!/usr/bin/env bash
echo "Select the project user password: "
read -s overbookd_pwd

echo "Enter the root password for mysql"
mysql -u root -p <<EOF
CREATE DATABASE overbookd;
CREATE USER 'overbookd'@'localhost' IDENTIFIED WITH mysql_native_password BY '$overbookd_pwd';
GRANT ALL PRIVILEGES ON overbookd.* TO 'overbookd'@'localhost';
EOF

echo '{
  "pwd_overbookd": "$overbookd_pwd"
}' > assets/json/pwd.json
