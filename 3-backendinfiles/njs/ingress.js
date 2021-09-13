function getUpstream(req) {
 	var fs = require('fs')
        var upstreamfile;
	var upstream;
	var service;
	if ("variables" in req) {
		service = req.variables.ingress_service;
		if (service == "") {
			return invalidBackend(req, 404); 
		}
	}
	
	upstreamfile = "/etc/nginx/upstreams/" + service;
	try {
	    upstream = fs.readFileSync(upstreamfile, 'utf8');
	    var endpointArr = upstream.split("\n");
	    if (endpointArr.length == 1) {
		    if (endpointArr[0] != "") {
		    	return endpointArr[0].replace(/^\s+|\s+$/g, '');
	    	    }
		    return invalidBackend(req, 404);
            }
	    var randomBackend = Math.floor(Math.random() * (endpointArr.length - 1));
	    // The final replace is to remove some dirty line break
	    return endpointArr[randomBackend].replace(/^\s+|\s+$/g, '');
	    
	} catch (e) {
	    req.error(e)
	    return invalidBackend(req, 502);
        }
	return invalidBackend(req, 503);
}

function invalidBackend(req, code) {
	req.return(code, "Invalid Backend");
	req.finish();
	return "@invalidbackend"
}

export default {getUpstream};
