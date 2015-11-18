#!/bin/sh
curl -XPOST "http://localhost:9200/avitofilter/kewords/optionalUniqueId" -d 
"{ \"words\" : \"Fuck\"}"
"{ \"words\" : \"hot\"}"
