#!/bin/bash
docker run -it -p 18080:80 -v $PWD/etc/nginx.conf:/etc/nginx/nginx.conf -v $PWD/njs/:/etc/nginx/njs/ --rm nginx:stable
