let isDragging = false;
    let previousX;
    let slideWidth;

    function createSlider3d() {
        const _ = el => document.querySelector(el);
        const slider = _(".slider3d");
        const wrap = slider.querySelector(".slider3d_wrap");
        const all = wrap.children.length;
        const gCS = window.getComputedStyle(slider);
        const width = parseInt(gCS.width);
        slideWidth = width / all;
        const myR = width / (2 * Math.tan(Math.PI / all));
        const step = 360 / all;
        let angle = 0;

        for (let i = 0; i < all; i++) {
            const rad = i * step * Math.PI / 180;

            wrap.children[i].style.transform = `
                translate3d(${myR * Math.sin(rad)}px, 0, ${myR * Math.cos(rad)}px)
                rotateY(${i * step}deg)`;
        }

        function nav(d) {
            angle += step * d;
            wrap.style.transform = `
                translateZ(${-myR}px)
                rotateY(${angle}deg)`;
        }

        slider.addEventListener('mousedown', e => {
            isDragging = true;
            previousX = e.clientX;
        });

        slider.addEventListener('mousemove', e => {
            if (isDragging) {
                const diff = e.clientX - previousX;
                const slideOffset = Math.round(diff / slideWidth);
                nav(slideOffset);
                previousX = e.clientX;
            }
        });

        slider.addEventListener('mouseup', () => {
            isDragging = false;
        });

        slider.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        nav(0);
    }

    window.addEventListener("resize", createSlider3d);
    window.addEventListener("load", createSlider3d);