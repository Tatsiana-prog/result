var radius = 380; // Размер радиуса 
var autoRotate = false; // Отключаем автоматическое вращение по умолчанию
var imgWidth = 303;
var imgHeight = 215; // Высота изображений
let autoSpinInterval;  // Интервал для автоматической прокрутки
let currentRotationIndex = 0;  // Индекс текущего положения карусели
var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container'); 
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid]; // объединить 2 массива

// Размер изображений
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

// Размер земли - зависит от радиуса
var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

// Функция инициализации с настройкой начальной позиции второго изображения
function init(delayTime) {
  var startIndex = 1; // Начинаем с второго изображения (index 1)
  for (var i = 0; i < aEle.length; i++) {
    // Вычисляем угол для каждого элемента
    var angle = (i + startIndex) * (360 / aEle.length);
    aEle[i].style.transform = "rotateY(" + angle + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "none";  // Убираем анимацию
    // Применяем фильтр ко всем элементам, кроме центрального
    aEle[i].style.opacity = '1';
  }
}
// Вызываем функцию инициализации после задержки
setTimeout(init, 1000);

// Обработчик перемещения мыши для вращения карусели
var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 10;
document.onpointerdown = function (e) {
  clearInterval(odrag.timer);
  e = e || window.event;
  sX = e.clientX;
  sY = e.clientY;
  this.onpointermove = function (e) {
    e = e || window.event;
    nX = e.clientX;
    nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;

    // Ограничение вращения по оси X (вертикальная ось) на 60 градусов
    if (tY > 30) tY = 30;
    if (tY < 0) tY = 0;

    applyTranform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function () {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;

      // Ограничение вращения по оси X (вертикальная ось) на 60 градусов
      if (tY > 60) tY = 60;
      if (tY < 0) tY = 0;

      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };
  return false;
};

function applyTranform(obj) {
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = (yes ? 'running' : 'paused');
}

document.onmousewheel = function (e) {
  e = e || window.event;
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};

// Функция для переключения позиции карусели
function rotateCarousel(index) {
  // Рассчитываем угол для нужной карточки
  let angle = index * (360 / aEle.length); 
  aEle.forEach((ele, i) => {
    // Применяем вращение для каждого элемента по углу
    ele.style.transition = 'transform 1s';
    ele.style.transform = `rotateY(${(i - index) * (360 / aEle.length)}deg) translateZ(${radius}px)`;
    // Если это текущий элемент (центральная карточка), убираем фильтр
    if (i === index) {
      ele.style.opacity = '1';  // Убираем фильтр с текущего элемента
    } else {
      ele.style.opacity = '1';
      ele.style.filter = 'brightness(100%);'  // Применяем фильтр ко всем остальным
    }
  });
  currentRotationIndex = index; // Обновляем текущий индекс
  // После клика запускаем автоматическую прокрутку
  startAutoRotate();
}

// Вспомогательная функция для смены текущего индекса и переключения (по часовой стрелке)
function changeCarouselIndex() {
  var newIndex = currentRotationIndex + 1; // Сдвигаем вправо (по часовой стрелке)
  if (newIndex >= aEle.length) {
    newIndex = 0; // Переключаем на первый элемент, если индекс выходит за пределы
  }
  rotateCarousel(newIndex); // Вращаем карусель на новый индекс
}

// Функция для запуска автоматической прокрутки
function startAutoRotate() {
  // Очищаем существующий интервал (если был)
  if (autoSpinInterval) {
    clearInterval(autoSpinInterval);
  }
  // Запускаем новый интервал для автоматической прокрутки
  autoSpinInterval = setInterval(() => {
    changeCarouselIndex(); // Переход на следующий элемент
  }, 3000); // Переход каждую секунду
}

// Остановка автопрокрутки
function stopAutoRotate() {
  if (autoSpinInterval) {
    clearInterval(autoSpinInterval);
  }
}
