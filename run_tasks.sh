#!/bin/bash

USER_ID="918"

for i in {1..7}
do
  curl -X POST http://localhost:3001/api/v1/task \
       -H "Content-Type: application/json" \
       -d "{\"user_id\":\"$USER_ID\"}" &
done

wait