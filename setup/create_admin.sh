#!/usr/bin/env bash
# DO NOT RUN THIS SCRIPT ON PRODUCTION
# Create a user with admin role in keycloak to make it easier to test, CI and quickstart the project

# get admin access token
access_token=$(curl --location --request POST 'http://localhost:8180/auth/realms/master/protocol/openid-connect/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Cookie: connect.sid=s%3A-WC6AQ-D-4gteZyHjIloR0078FahkVqI.7i3GbQW5QpzlvzzDYX3JAa4QU1b2MQoaCzPz%2BFSnR%2F8' \
--data-urlencode "password=${KEYCLOAK_PASSWORD}" \
--data-urlencode 'username=admin' \
--data-urlencode 'client_id=admin-cli' \
--data-urlencode 'grant_type=password' | jq -r '.access_token')

echo "User created"
#echo $access_token

#create user: user_admin
curl --location --request POST 'http://localhost:8180/auth/admin/realms/project_a/users' \
--header "Authorization: Bearer $access_token" \
--header 'Content-Type: application/json' \
--header 'Cookie: connect.sid=s%3A-WC6AQ-D-4gteZyHjIloR0078FahkVqI.7i3GbQW5QpzlvzzDYX3JAa4QU1b2MQoaCzPz%2BFSnR%2F8' \
--data-raw '{
    "id": "3ea9064a-6239-4c99-b34c-28349e09b646",
    "enabled":true,
    "attributes":{},
    "emailVerified":"",
    "username":"user_admin",
    "credentials": [{
        "type":"password",
        "value":"user_admin",
        "temporary":false
        }
    ]
}'

# Get user ID
id=$(curl --location --request GET 'http://localhost:8180/auth/admin/realms/project_a/users' \
--header "Authorization: Bearer $access_token" \
--header 'Cookie: connect.sid=s%3A-WC6AQ-D-4gteZyHjIloR0078FahkVqI.7i3GbQW5QpzlvzzDYX3JAa4QU1b2MQoaCzPz%2BFSnR%2F8' | jq -r '.[0] .id')

echo "ID : $id"

# Give roles
curl --location --request POST "http://localhost:8180/auth/admin/realms/project_a/users/$id/role-mappings/realm" \
--header "Authorization: Bearer $access_token" \
--header 'Content-Type: application/json' \
--header 'Cookie: connect.sid=s%3A-WC6AQ-D-4gteZyHjIloR0078FahkVqI.7i3GbQW5QpzlvzzDYX3JAa4QU1b2MQoaCzPz%2BFSnR%2F8' \
--data-raw '[
    {
        "id": "bde31a4e-184e-4407-8c68-f5eee9480f27",
        "name": "user_admin",
        "composite": true,
        "clientRole": false,
        "containerId": "project_a"
    }
]'


# Feedback
echo "user_admin created and granted admin role"
