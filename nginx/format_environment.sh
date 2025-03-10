#! /bin/sh

FOLDER="/usr/share/nginx/html"

# Check if the folder exists and is a directory
if [ ! -d "$FOLDER" ]; then
    echo "Error: '$FOLDER' is not a valid directory."
    exit 1
fi

grep -o 'ENV__[A-Z_]\+__' -r "$FOLDER" | while IFS=":" read -r file var; do
    echo "Processing: $file $var"

    env_var_name=$(echo "$var" | sed 's/^ENV__//;s/__//g')  # Extract ENV variable name
    env_value=$(eval echo \$$env_var_name)

    if [ -n "$env_value" ]; then
        sed -i "s|$var|$env_value|g" "$file"
    else
        echo "Warning: $env_var_name is not set in the environment."
        exit 1
    fi
done 