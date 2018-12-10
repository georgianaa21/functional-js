let locationIn = document.getElementById('location');
let idIn = document.getElementById('id');
let button = document.getElementById('the_button');
let container = document.getElementById('container');
idIn.addEventListener('change', changeText);
button.addEventListener('click', fetchData);

function changeText(e) {
    if(idIn.value) {
        button.innerHTML = 'Get forecast';
    }
    else {
        button.innerHTML = "Get location";
    }
    return button.innerHTML;
}

function fetchData(event) {
    event.preventDefault();
    let responseData = [];
    let city =  locationIn.value;
    let id = idIn.value;
    console.log(button.innerHTML);
    if(button.innerHTML === 'Get location') {
        axios.get(`https://www.metaweather.com/api/location/search/?query=${city}`)
            .then((response) => {
                responseData = response.data;
                console.log(responseData[0].title);
                if(responseData) {
                    createLocationData(responseData[0].title, responseData[0].location_type, responseData[0].woeid);
                }
                else {
                    createErrorParagraph();
                }
            }).catch((err) => {
                console.log(err);
            })
    } else {
        axios.get(`https://www.metaweather.com/api/location/${id}`)
            .then((response) => {
                responseData = response.data;
                if(responseData) {
                    createForecast(responseData);
                } else {
                    createErrorParagraph();
                }
            }).catch((err) => {
                console.log(err);
                createErrorParagraph();
            })
    }
}

function createErrorParagraph() {
    let errorP = document.createElement('p');
    errorP.innerHTML = 'Please insert valid data!';
    container.insertBefore(errorP, container.childNodes[0]);
}

function createLocationData(name, type, id) {
    let locationP = document.createElement('p');
    locationP.innerHTML = name + ' ' + type + ' ' + id;
    container.insertBefore(locationP, container.childNodes[0]);
}

function createForecast(data) {
    let list = document.createElement('ul');
    let header = document.createElement('h6');
    header.innerHTML = 'Weather for ' + data.title;
    data.consolidated_weather.forEach((day_weather) => {
        let listItem = document.createElement('li');
        
        let state = day_weather.weather_state_abbr;
        let image = document.createElement('img');
        image.setAttribute('src', `https://www.metaweather.com/static/img/weather/${state}.svg`);
        image.setAttribute('width', '50px');
        image.setAttribute('height', '50px');
        listItem.innerHTML = day_weather.applicable_date;
        listItem.insertBefore(image, listItem.childNodes[0]);
        list.insertBefore(listItem, list.childNodes[0]);
    })
    list.insertBefore(header, list.childNodes[0]);
    container.insertBefore(list, container.childNodes[0]);
}