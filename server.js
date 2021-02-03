const dataCity = require('./dataCity');
var data = require('./data');
var weatherCode = require('./weatherCode');

const axios = require('axios');

const TOKEN = 'e0b2383492e80cc1257d60156e31300cb077bcf8620efba2a00a01d1235299da';

var forcastUrl = "https://api.meteo-concept.com/api/forecast/daily?token=";
var key = '&insee=';

//axios.defaults.baseURL = 'https://api.meteo-concept.com';
//axios.defaults.headers.common['Authorization'] = 'e0b2383492e80cc1257d60156e31300cb077bcf8620efba2a00a01d1235299da';

var dataCities = [];
const promisesAll = [];

const fs = require("fs");
const fastcsv = require("fast-csv");
const { writeToPath } = require('@fast-csv/format');

let stream = fs.createReadStream("data.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();

    for (let i = 0; i < csvData.length; i++) {
        var reqUrl = forcastUrl + TOKEN + key + csvData[i][4];
        var dataFromApi = getWeatherDataForOneDay(reqUrl, i);
        promisesAll.push(dataFromApi);
    }
    
    Promise.all(promisesAll).then( () => {
        console.log('Tous les fichiers ont été lus avec succès');
        console.log(dataCities);
        var aujd = new Date();
        var annee = aujd.getFullYear();
        var mois = aujd.getMonth()
        var jour = aujd.getDay()
        console.log(annee);

        writeToPath('./data/'+'output-data-'+annee+'-'+mois+'-'+jour+'.csv', dataCities)
            .on('error', err => console.error(err))
            .on('finish', () => console.log('Done writing.'));
    });

  });

stream.pipe(csvStream);


    /*
    for (let i = 0; i < data.length; i++) {
        var reqUrl = forcastUrl + TOKEN + key + data[i].insee;
        var dataFromApi = getWeatherDataForOneDay(reqUrl, i);
        promisesAll.push(dataFromApi);
    }*/

function getWeatherDataForOneDay (reqUrl, i){
       return axios.get(reqUrl)
            .then((response) => { fillTab2(response, i) })
            .catch((error) =>{ console.log(error); });
}


function fillTab2 (response, i){
    forecast = response.data.forecast[0] ;

    var dataCurrentCity = new dataCity(
        csvData[i][0],
        csvData[i][1],
        csvData[i][2],
        csvData[i][3],
        csvData[i][4],
        forecast.probarain,
        forecast.weather,
        forecast.tmin,
        forecast.tmax,
        forecast.sun_hours,
        weatherCode[forecast.weather]
    )
    dataCities.push(dataCurrentCity);
}
