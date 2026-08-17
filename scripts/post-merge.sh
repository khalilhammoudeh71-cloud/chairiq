#!/bin/bash
# Post-merge setup: reinstall dependencies so merged tasks
# that add/update packages work immediately.
set -e

cd chairiq
npm install --no-audit --no-fund
