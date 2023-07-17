function get(r) {
    r.return(200, ngx.shared.backends.get(r.args.key));
}

function set(r) {
    var service;
    service = r.args.key
    if (service == "" || service == null ) {
        r.return(400, "key should not be null")
        r.finish()
        return
    }
    
    try {
        JSON.parse(r.requestText)
        ngx.shared.backends.set(r.args.key, r.requestText)
        r.return(200, "ok")
        r.finish()
    } catch (e) {
        r.error(e)
        r.return(400, "error parsing json payload")
        r.finish()
    }
}

function del(r) {
        r.return(200, ngx.shared.backends.delete(r.args.key));
}

function getUpstream(r) {
    var service;

    try {
        if ("variables" in r) {
            service = r.variables.ingress_service;
        }

        if (service == "") {
            throw "no service variable"
        }
    
        const backends = ngx.shared.backends.get(service)
        if (backends == "" || backends == null) {
            throw "no backend configured"
        }

        const objBackend = JSON.parse(backends)
        if (objBackend["endpoints"] == null || objBackend["endpoints"] == undefined) {
            throw "bad endpoints object" // TODO: This validation should happen when receiving the json
        }

        if (!Array.isArray(objBackend["endpoints"])) {
            throw "endpoint object is not an array"
        }

        if (objBackend["endpoints"].length < 1) {
            throw "no backends available for the service"
        }

        var randomBackend = Math.floor(Math.random() * (objBackend["endpoints"].length));
        if (typeof objBackend["endpoints"][randomBackend] != 'string') {
            throw "endpoint is not a string"        
        }
        return objBackend["endpoints"][randomBackend]
    
    } catch (e) {
        r.error(e)
        r.return(502, "error getting backends: "+ e)
        r.finish()
        return "@invalidbackend"
    } 
}

export default {get, set, del, getUpstream};