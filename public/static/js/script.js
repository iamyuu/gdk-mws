const $ = elmnt => document.querySelector(elmnt)

$('#getThisYear').innerHTML = new Date().getFullYear()

$('form').onsubmit = function (e) {
  e.preventDefault()

  let number1 = $('#angka_1').value
  let number2 = $('#angka_2').value
  let calculate = parseInt(number1) + parseInt(number2)
  
  $('#result').innerHTML = isNaN(calculate) ? 'Gagal menjumlahkan' : `Hasilnya ${calculate}`

  $('#angka_1').value = ''
  $('#angka_2').value = ''
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js', { scope: '/' })
      .then(reg =>  console.log(`Service worker has been registered for scope: ${reg.scope}`))
      .catch(err => console.log(`Failed to register service worker. ${err}`))
  })
}

(async function () {
  try {
    const response = await fetch('static/content.json')
    
    if (!response.ok)
      throw response.statusText

    const { profile, repository, randomContent, mapbox } = await response.json()
  
    // profile
    $('#profile').href      = `mailto:${profile.email}`
    $('#profile').innerHTML = profile.name
    $('#profileImage').src  = profile.image
    $('#profileDescription').innerHTML = profile.description

    // footer
    $('#footerName').innerHTML = profile.name
    $('#footerGit').innerHTML  = repository.git
    $('#footerGit').href       = repository.url

    // random content
    $('#randomContentTitle').innerHTML = randomContent.title
    $('#randomContent').innerHTML      = randomContent.content

    // mapbox
    $('#mapboxTitle').innerHTML = mapbox.title
    $('#mapboxContent').innerHTML = mapbox.content
  } catch (e) {
    console.log('Error fetching data.', e)
  }
})()