#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  -- Extensions for marketplace features
  CREATE EXTENSION IF NOT EXISTS "pg_trgm";       -- Fuzzy text search (trigram matching)
  CREATE EXTENSION IF NOT EXISTS "unaccent";       -- Accent-insensitive search (Icelandic: hofn -> höfn)
  CREATE EXTENSION IF NOT EXISTS "btree_gin";      -- GIN index support for standard types
EOSQL

echo "✓ PostgreSQL extensions installed: pg_trgm, unaccent, btree_gin"
