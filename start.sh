#!/bin/bash
export PERSONA_PATH="$(dirname "$0")/persona"
export NODE_FUNCTION_ALLOW_BUILTIN=fs,crypto
echo "🚀 Lancement de N8N avec PERSONA_PATH=$PERSONA_PATH"
n8n
