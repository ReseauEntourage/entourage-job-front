#!/bin/bash
while IFS= read -r line <&3 || [[ -n "$line" ]];
do
    if [[ $line == \#\#* ]]; then
        echo "$line" >> .env
        continue
    fi

    key=$(echo "$line" | cut -d'=' -f1)
    value=$(echo "$line" | cut -d'=' -f2-)
    
    if [[ -z "$value" ]]; then
        read -p "Entrez la valeur pour $key: " input
        echo "$key=\"$input\"" >> .env
    else
        echo "$line" >> .env
    fi
done 3< .env.dist