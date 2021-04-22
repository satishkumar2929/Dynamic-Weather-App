const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync('home.html','utf-8');

const replaceVal = (tempVal, orgVal)=>{
    let temperature = tempVal.replace('{%tempval%}', orgVal.main.temp);
    temperature = temperature.replace('{%tempmin_val%}', orgVal.main.temp_min);
    temperature = temperature.replace('{%tempmax_val%}', orgVal.main.temp_max);
    temperature = temperature.replace('{%city%}', orgVal.name);
    temperature = temperature.replace('{%country%}', orgVal.sys.country);
    temperature = temperature.replace("{%temperatureStatus%}", orgVal.weather[0].main);
    console.log(orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res )=>{
    if(req.url == "/"){
        requests('http://api.openweathermap.org/data/2.5/weather?q=indore&units=metric&appid=71a55358931ea5d5fdbbdbbcfa70a800')
.on('data',(chunk) =>{
    const objData = JSON.parse(chunk);
    const arrData = [objData];
  // console.log(arrData[0].main)
  const realTimeData = arrData.map((val)=> replaceVal(homeFile,val)).join("");
  res.write(realTimeData);
  // console.log(realTimeData);
})
.on('end', (err) =>{
  if (err) return console.log('connection closed due to errors', err);
 res.end();
  // console.log('end page');
})
 }
 else {
     res.end('Page Not found');
 }
});

server.listen(8000,'127.0.0.1');