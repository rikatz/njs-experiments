function getUpstream(req) {
	var host; 
	host = req.headersIn['Host'].toLowerCase();
	if (host == "mydomain1.com") {
		return "https://www.google.com"
	}
	if (host == "mydomain2.com") {
		return "https://www.amazon.com"
	}
	req.return(404, "Backend not found");
	req.finish();
	// Invalid return just so it wont complain
	return "http://lalallalalala.com"
}

export default {getUpstream};
