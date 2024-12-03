let isDragging = false;
let previousX;
let slideWidth;

function createSlider3d() {
    const slider = document.querySelector(".slider3d");
    const wrap = slider.querySelector(".slider3d_wrap");
    const all = wrap.children.length;
    const gCS = window.getComputedStyle(slider);
    const width = parseInt(gCS.width);
    slideWidth = width / all;
    const myR = (width / (2 * Math.tan(Math.PI / all))) *0.95;
    const step = 360 / all;
    let angle = 0;

    // Устанавливаем начальные трансформации для всех элементов
    for (let i = 0; i < all; i++) {
        const rad = i * step * Math.PI / 180;
        wrap.children[i].style.transform = `translate3d(${myR * Math.sin(rad)}px, 0, ${myR * Math.cos(rad)}px) rotateY(${i * step}deg)`;
    }

    // Функция навигации
    function nav(d) {
        angle += step * d;
        wrap.style.transform = `translateZ(${-myR}px) rotateY(${angle}deg)`;
    }

    // Обработчики событий
    const onMouseDown = (e) => {
        isDragging = true;
        previousX = e.clientX;
    };

    const onMouseMove = (e) => {
        if (isDragging) {
            const diff = e.clientX - previousX;
            const slideOffset = Math.round(diff / slideWidth);
            nav(slideOffset);
            previousX = e.clientX;
        }
    };

    const onMouseUpOrLeave = () => {
        isDragging = false;
    };

    // Слушатели событий
    slider.addEventListener('mousedown', onMouseDown);
    slider.addEventListener('mousemove', onMouseMove);
    slider.addEventListener('mouseup', onMouseUpOrLeave);
    slider.addEventListener('mouseleave', onMouseUpOrLeave);

    // Инициализация начальной позиции
    nav(0);
}

// Дебаунс для события resize
let resizeTimeout;
function onResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(createSlider3d, 200);
}

window.addEventListener("resize", onResize);
window.addEventListener("load", createSlider3d);
