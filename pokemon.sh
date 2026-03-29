#!/bin/bash

# Script to list the first 150 Pokémon using the public PokéAPI
# API: https://pokeapi.co/api/v2/pokemon

API_URL="https://pokeapi.co/api/v2/pokemon?limit=150"

echo "Buscando os primeiros 150 Pokémon na PokéAPI..."
echo "================================================"

# Check if curl is available
if ! command -v curl &> /dev/null; then
  echo "Erro: 'curl' não está instalado. Por favor, instale o curl e tente novamente."
  exit 1
fi

# Check if jq is available
if ! command -v jq &> /dev/null; then
  echo "Erro: 'jq' não está instalado. Por favor, instale o jq e tente novamente."
  exit 1
fi

# Fetch data from the API
if ! RESPONSE=$(curl -s "$API_URL"); then
  echo "Erro: Não foi possível conectar à PokéAPI. Verifique sua conexão com a internet."
  exit 1
fi

if [ -z "$RESPONSE" ]; then
  echo "Erro: Não foi possível conectar à PokéAPI. Verifique sua conexão com a internet."
  exit 1
fi

# Parse and display the list
echo "$RESPONSE" | jq -r '.results | to_entries[] | "#\(.key + 1) - \(.value.name | ascii_upcase)"'

echo "================================================"
echo "Total: $(echo "$RESPONSE" | jq '.results | length') Pokémon listados."
