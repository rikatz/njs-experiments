# Dynamic backends with NJS and shared map

NJS introduced a new feature: `js_shared_dict_zone`.

This feature works very much like the openresty lua map: it is a map, in memory,
shared between workers/threads.

This way, we can, following the same openresty approach, use it for dynamic backend selection.

## Quickstart
Build the docker container from here. Then start it

```shell
docker build -t testnjs .
docker run -it --rm -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf -v $(pwd)/js:/etc/nginx/js -p 8000:80 testnjs
```

From another terminal, set the backends of a location. The `key` value should be the same defined 
on the location as `set $ingress_service`. The body should be a JSON like:

```json
{
    "endpoints": 
    [
        "endpoint1",
        "endpoint2"
    ]
}
```

In my example I'm pointing it to Google or Amazon: `curl -d '{"endpoints": ["www.google.com.br","www.amazon.com"]}' "127.0.0.1:8000/backends/set?key=servicebla"`

Checking the map configuration we can verify the backends are configured:
`curl "127.0.0.1:8000/backends/get?key=servicebla"`

Now, getting the location "/bla" should return us, randomly, Google or Amazon:

```shell
curl -v 127.0.0.1:8000/bla
...
Google
...

curl -v 127.0.0.1:8000/bla
...
Amazon
...
```

Replacing the backends for Yahoo should return only Yahoo: 
```shell
curl -d '{"endpoints": ["www.yahoo.com"]}' "127.0.0.1:8000/backends/set?key=servicebla"
ok%
curl -v 127.0.0.1:8000/bla
...
Yahoo
...
```