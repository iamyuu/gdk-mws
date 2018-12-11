(async function () {
  const $ = elmnt => document.querySelector(elmnt)

  const map = L.map('map').setView([-6.5976289, 106.7973811], 14)
  map.zoomControl.setPosition('topright')

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiaWFteXV1IiwiYSI6ImNqbTVwbmtnZzA1b3QzcHFxd3phYjVvMHEifQ.QxQAk1ATT95ebDJ__Pe1lQ'
  }).addTo(map)

  try {
    let response = await fetch('static/content.json')

    if (!response.ok)
      throw response.statusText

    let { profile, repository, places } = await response.json()

    localStorage.setItem('places', JSON.stringify(places))

    $('#footerName').innerHTML = profile.name
    $('#footerGit').innerHTML  = repository.git
    $('#footerGit').href       = repository.url
  } catch (e) {
    console.log(e)
  }

  let places = JSON.parse(localStorage.getItem('places'))

  const findLocation = function (x, y) {
    for (let i = 0; i < places.length; i++) {
      if (places[i].location[0] === x && places[i].location[1] === y)
        return i
    }
    return -1
  }

  const showDetail = function (index) {
    $('#image').src = places[index].image
    $('#image').alt = places[index].name
    $('#title').innerHTML  = places[index].name
    $('#review').innerHTML = places[index].description
  }

  const showLocation = function (e) {
    const index = findLocation(e.latlng.lat, e.latlng.lng)
    if (index >= 0)
      showDetail(index)
  }

  if (places) {
    places.map(function (place, index) {
      let marker = L.marker(place.location)
                    .addTo(map)
                    .bindPopup(`<b>${place.name}</b><br>${place.description}`)

      marker.on('click', showLocation)

      if (index === 2)
        marker.openPopup()
    })

    showDetail(2);
  }
})()