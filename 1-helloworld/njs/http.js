function hello(r) {
    r.error(JSON.stringify(r));
    r.return(200, "Hello world!");
}

export default {hello};
