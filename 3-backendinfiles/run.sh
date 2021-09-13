#!/bin/bash
docker run -it -p 18080:80 -v $PWD/etc/nginx.conf:/etc/nginx/nginx.conf -v $PWD/njs/:/etc/nginx/njs/ -v $PWD/upstreams/:/etc/nginx/upstreams/ --rm nginx:stable
