const CLEFAPI = '8e9391f167c17b3253b145b2a036ffd4';
let resultatsAPI;

const weather = document.querySelector('.weather');
const currentTemp = document.querySelector('.currentTemp');
const localisation = document.querySelector('.localisation');
const joursDiv = document.querySelectorAll('.dayWeatherName');
const tempJoursDiv = document.querySelectorAll('.dayWeatherTemp');
const time = document.querySelectorAll('.timeName');
const tempPourH = document.querySelectorAll('.timeValue');

const humiJoursDiv = document.querySelectorAll('.jour-prevision-himi');
const leveJoursDiv = document.querySelectorAll('.jour-soleil-leve');
const coucheJoursDiv = document.querySelectorAll('.jour-soleil-couche');
const weatherLogo = document.querySelector('.weatherLogo');


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

function AppelAPI(long, lat) {

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=imperial&appid=${CLEFAPI}`)
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
        for(let k = 0; k < tabJoursEnOrdre.length; k++) {
            joursDiv[k].innerText = tabJoursEnOrdre[k].slice(0,3);
        }

        // Weather for each day
        for(let m = 0; m < 7; m++){
            tempJoursDiv[m].innerText = `${Math.floor(resultatsAPI.daily[m + 1].temp.day)}°F`
        }


        // // Levé soleil par jour
        // for(let l = 0; l < 7; l++){
        //     let unix_timestamp = resultatsAPI.daily[l + 1].sunrise
        //     // Create a new JavaScript Date object based on the timestamp
        //     // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        //     var date = new Date(unix_timestamp * 1000);
        //     // Hours part from the timestamp
        //     var hours = date.getHours();
        //     // Minutes part from the timestamp
        //     var minutes = "0" + date.getMinutes();
    
        //     // Will display time in 10:30:23 format
        //     var formattedTime = hours + ':' + minutes.substr(-2);
        //     leveJoursDiv[l].innerText = formattedTime
        // }

        // // Levé soleil par jour
        // for(let c = 0; c < 7; c++){
        //     let unix_timestamp = resultatsAPI.daily[c + 1].sunset
        //     // Create a new JavaScript Date object based on the timestamp
        //     // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        //     var date = new Date(unix_timestamp * 1000);
        //     // Hours part from the timestamp
        //     var hours = date.getHours();
        //     // Minutes part from the timestamp
        //     var minutes = "0" + date.getMinutes();
    
        //     // Will display time in 10:30:23 format
        //     var formattedTime2 = hours + ':' + minutes.substr(-2);
        //     coucheJoursDiv[c].innerText =  formattedTime2
        // }


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

const joursSemaine = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


let ajd = new Date();
let options = {weekday: 'long'};
let jourActuel = ajd.toLocaleDateString('fr-FR', options);
// console.log(jourActuel, ajd);

jourActuel = jourActuel.charAt(0).toUpperCase() + jourActuel.slice(1);

let tabJoursEnOrdre = joursSemaine.slice(joursSemaine.indexOf(jourActuel)).concat(joursSemaine.slice(0, joursSemaine.indexOf(jourActuel)));
// console.log(tabJoursEnOrdre);

fetch(`http://api.airvisual.com/v2/nearest_city?key=e84938b6-92b7-4e22-a26c-7d6f95160eff`)
    .then(response => response.json())
    .then(data => {
        console.log(data)

});