'use strict';

var mapApp = document.querySelector('.map');
mapApp.classList.remove('map--faded');

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var HOUSE_TYPE = ['palace', 'flat', 'house', 'bungalo'];
var HOUSE_TYPE_RU = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var ADS_QUANTITY = 8;

var similarAds = [];

// отдельная функция для генерации случайного число в интервале [min, max]
function randomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

// отдельная функция для генерации случайного числа, исходя из длины массива на входе
var getRandNum = function (array) {
  return Math.floor(Math.random() * array.length);
};

// отдельная функция для перетасовки массива
var shuffleArray = function (array) {
  var x;
  var j;
  for (var i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = array[i];
    array[i] = array[j];
    array[j] = x;
  }
  return array;
};

var generateAdsData = function (num) {
  for (var i = 0; i < num; i++) {
    var ad = {};
    ad.location = {};
    ad.location.x = randomInteger(1 + 65, 980 - 65);
    ad.location.y = randomInteger(130 + 65, 630 - 65);
    ad.author = {};
    ad.author.avatar = 'img/avatars/user0' + randomInteger(1, 8) + '.png';
    ad.offer = {};
    ad.offer.title = TITLES[i];
    ad.offer.address = ad.location.x + ', ' + ad.location.y;
    ad.offer.price = randomInteger(1000, 1000000);
    ad.offer.type = HOUSE_TYPE[getRandNum(HOUSE_TYPE)];
    ad.offer.rooms = randomInteger(1, 5);
    ad.offer.guests = randomInteger(1, 10);
    ad.offer.checkin = CHECKIN[getRandNum(CHECKIN)];
    ad.offer.checkout = CHECKOUT[getRandNum(CHECKOUT)];
    ad.offer.features = FEATURES.slice(1, randomInteger(2, FEATURES.length));
    ad.offer.description = '';
    ad.offer.photos = shuffleArray(PHOTOS);
    similarAds.push(ad);
  }
};

generateAdsData(ADS_QUANTITY);

// метки
var pinList = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content;

var renderPin = function (ad) {
  var pinElement = pinTemplate.cloneNode(true).querySelector('.map__pin');
  pinElement.setAttribute('style', 'left: ' + ad.location.x + 'px; top: ' + ad.location.y + 'px;');
  pinElement.children[0].setAttribute('src', ad.author.avatar);
  pinElement.children[0].setAttribute('alt', ad.offer.title);
  return pinElement;
};

var fragmentPin = document.createDocumentFragment();
for (var i = 0; i < similarAds.length; i++) {
  fragmentPin.appendChild(renderPin(similarAds[i]));
}

pinList.appendChild(fragmentPin);

// объявления
var adList = document.querySelector('.map');
var adTemplate = document.querySelector('#card').content.querySelector('.map__card');

var renderAd = function (ad) {
  var adElement = adTemplate.cloneNode(true);
  adElement.querySelector('.popup__title').textContent = ad.offer.title;
  adElement.querySelector('.popup__text--address').textContent = ad.offer.address;
  adElement.querySelector('.popup__text--price').textContent = ad.offer.price + ' ₽/ночь';
  adElement.querySelector('.popup__type').textContent = HOUSE_TYPE_RU[HOUSE_TYPE.indexOf(ad.offer.type)];
  adElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;
  adElement.querySelector('.popup__features').textContent = ad.offer.features;
  adElement.querySelector('.popup__description').textContent = ad.offer.description;
  // adElement.querySelector('.popup__photos').querySelector('.popup__photo').setAttribute('src', '' + ad.offer.photos[0]); // как вывести 3?
  var popupPhotosList = adElement.querySelector('.popup__photos'); // куда вставлять
  var popupPhotoTemplate = popupPhotosList.querySelector('.popup__photo'); // что копировать
  popupPhotoTemplate.setAttribute('src', '' + PHOTOS[0]); // заполняем первый элемент, чтобы потом было что копировать
  for (var k = 1; k < PHOTOS.length; k++) {
    var photoElement = popupPhotoTemplate.cloneNode(true);
    photoElement.setAttribute('src', '' + PHOTOS[k]);
    popupPhotosList.appendChild(photoElement);
  }
  adElement.querySelector('.popup__avatar').setAttribute('src', '' + ad.author.avatar);
  return adElement;
};

var fragmentAd = document.createDocumentFragment();
fragmentAd.appendChild(renderAd(similarAds[0]));

adList.insertBefore(fragmentAd, adList.children[1]);
