const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homefile = fs.readFileSync("./home.html", "utf-8");

// console.log(homefile);

const replaceVal = (tempVal, orgVal) => {
    tempVal = tempVal.replace("{%tempval%}", (orgVal.main.temp - 273).toFixed(2));
    tempVal = tempVal.replace("{%tempmin%}", (orgVal.main.temp_min - 273).toFixed(2));
    tempVal = tempVal.replace("{%tempmax%}", (orgVal.main.temp_max - 273).toFixed(2));
    tempVal = tempVal.replace("{%location%}", orgVal.name);
    tempVal = tempVal.replace("{%country%}", orgVal.sys.country);
    tempVal = tempVal.replace("{%tempStatus%}", orgVal.weather[0].main);
    return tempVal;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Gwalior&appid=3b701b97f7580dda8bd3949b16c76ded")
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                // const arrData = [objData];   
                // console.log(arrData);
                const realTimeData = replaceVal(homefile, objData);
                res.writeHead(200, { "Content-type": "text/html" });
                res.end(realTimeData);
                // console.log(realTimeData);
                // res.end("hello weather");
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
                // console.log('end');
            });
    }
});

server.listen(8000, "127.0.0.1", () => { console.log("Listening"); });