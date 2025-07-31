#!/bin/bash
# Script: netlify-port.sh
# Uso: ./netlify-port.sh
# Muestra el puerto real donde está corriendo Netlify CLI (dev)

# Busca el proceso de Netlify dev
PID=$(ps aux | grep 'netlify dev' | grep -v grep | awk '{print $2}' | head -n 1)

if [ -z "$PID" ]; then
  echo "[netlify-port] Netlify CLI no está corriendo. Ejecuta: npx netlify dev"
  exit 1
fi

# Busca el puerto asociado al proceso
PORT=$(lsof -nP -p $PID | grep LISTEN | grep TCP | awk '{print $9}' | sed 's/.*://')

if [ -z "$PORT" ]; then
  echo "[netlify-port] No se pudo detectar el puerto automáticamente."
  echo "Revisa la terminal donde ejecutaste 'npx netlify dev' para ver el puerto."
  exit 2
fi

# Imprime el link directo
echo "[netlify-port] Netlify CLI está corriendo en: http://localhost:$PORT/"
