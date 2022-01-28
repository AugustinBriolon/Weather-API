const ApiKey = '8e9391f167c17b3253b145b2a036ffd4';
const ApiKey2 = '87f51655-9722-4c30-ad92-4c0b5b08f29e'
let resultatsAPI;
let formattedTime

const weather = document.querySelector('.weather');
const currentTemp = document.querySelector('.currentTemp');
const localisation = document.querySelector('.localisation');
const joursDiv = document.querySelectorAll('.dayWeatherName');
const tempJoursDiv = document.querySelectorAll('.dayWeatherTemp');
const time = document.querySelectorAll('.timeName');
const tempPourH = document.querySelectorAll('.timeValue');

const humiJoursDiv = document.querySelectorAll('.jour-prevision-himi');
const leveJoursDiv = document.querySelectorAll('.leveJoursDiv');
const coucheJoursDiv = document.querySelectorAll('.coucheJoursDiv');
const weatherLogo = document.querySelector('.weatherLogo');


const aqiusCommentToInsert = document.querySelector('.aqiusComment')
const aqiusToInsert = document.querySelector('.aqius')
const atmosToInsert = document.querySelector('.atmos')
const windToInsert = document.querySelector('.wind')
const windDirectionToInsert = document.querySelector('.windDirection')


const daysWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];



function convertUnix(unix) {
    let unix_timestamp = unix
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp * 1000);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();

    // Will display time in 10:30:23 format
    formattedTime = hours + ':' + minutes.substr(-2);

}
function getAqius(aqius) {
    aqiusToInsert.innerText = aqius
    if (aqius >= 0 && aqius <= 50) {
        aqiusCommentToInsert.innerText = 'Good'
    } else if (aqius > 50 && aqius <= 100) {
        aqiusCommentToInsert.innerText = 'Moderate'
    } else if (aqius > 100 && aqius <= 150) {
        aqiusCommentToInsert.innerText = 'Bad for sensitive group'
    } else if (aqius > 150 && aqius <= 200) {
        aqiusCommentToInsert.innerText = 'Bad'
    } else if (aqius > 200 && aqius <= 300) {
        aqiusCommentToInsert.innerText = 'Very bad'
    } else if (aqius > 300) {
        aqiusCommentToInsert.innerText = 'Dangerous'
    }
}

function AppelAPI(long, lat) {

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=imperial&appid=${ApiKey}`)
    .then((reponse) => {
        return reponse.json();
    })
    .then((data) => {

        resultatsAPI = data;

        weather.innerText = resultatsAPI.current.weather[0].description;
        currentTemp.innerText = `${Math.trunc(resultatsAPI.current.temp)}°F`
        localisation.innerText = resultatsAPI.timezone;


        // les times, par tranche de trois, avec leur temperature.

        let timeActuelle = new Date().getHours();

        for(let i = 0; i < time.length; i++) {

            let timeIncr = timeActuelle + i * 3;

            if(timeIncr > 24) {
                time[i].innerText = `${timeIncr - 24} h`;
            } else if(timeIncr === 24) {
                time[i].innerText = "00 h"
            } else {
                time[i].innerText = `${timeIncr} h`;
            }

        }

        // Temp pour 3h
        for(let j = 0; j < tempPourH.length; j++) {
            tempPourH[j].innerText = `${Math.trunc(resultatsAPI.hourly[j * 3].temp)}°F`
        }

        // Trois premieres lettres des jours 
        for(let k = 0; k < getDays().length; k++) {
            joursDiv[k].innerText = getDays()[k].slice(0,3);
        }

        // Weather for each day
        for(let m = 0; m < 7; m++){
            tempJoursDiv[m].innerText = `${Math.floor(resultatsAPI.daily[m + 1].temp.day)}°F`
        }

        for(let l = 0; l < 7; l++){
            convertUnix(resultatsAPI.daily[l + 1].sunrise)
            leveJoursDiv[l].innerText = formattedTime
        }
        for(let l = 0; l < 7; l++){
            convertUnix(resultatsAPI.daily[l + 1].sunset)
            coucheJoursDiv[l].innerText = formattedTime
        }

        


        // // Humidité par jour
        // for(let h = 0; h < 7; h++){
        //     humiJoursDiv[h].innerText = resultatsAPI.daily[h + 1].humidity
        // }

        // Icone dynamique 
        if(timeActuelle >= 9 && timeActuelle < 18) {
            weatherLogo.src = `assets/img/jour/${resultatsAPI.current.weather[0].icon}.svg`
        } else  {
            weatherLogo.src = `assets/img/nuit/${resultatsAPI.current.weather[0].icon}.svg`
        }

        // console.log(weatherLogo.src );
    })

}


function getDays() {
    jourActuel = jourActuel.charAt(0).toUpperCase() + jourActuel.slice(1);
    
    let tabJoursEnOrdre = daysWeek.slice(daysWeek.indexOf(jourActuel)).concat(daysWeek.slice(0, daysWeek.indexOf(jourActuel)));

    return tabJoursEnOrdre
    
}
if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {

        // console.log(position);
        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        AppelAPI(long,lat);

    }, () => {
        alert(`You refused geolocation, the application cannot work, please activate it.`)
    })
}

let ajd = new Date();
let options = {weekday: 'long'};
let jourActuel = ajd.toLocaleDateString('fr-FR', options);
// console.log(jourActuel, ajd);


fetch(`http://api.airvisual.com/v2/nearest_city?key=${ApiKey2}`)
    .then(response => response.json())
    .then(data => {
        console.log(data.data);

        getAqius(data.data.current.pollution.aqius)

        atmosToInsert.innerText = data.data.current.weather.pr
        windToInsert.innerText = data.data.current.weather.ws
        windDirectionToInsert.innerText = data.data.current.weather.wd


});