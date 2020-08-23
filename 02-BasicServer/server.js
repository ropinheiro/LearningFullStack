require("http").createServer((inRequest, inResponse) => {
    inResponse.end("Hello from my first Node Web Server");
}).listen(4600);