document.addEventListener("DOMContentLoaded", function () {
    let items = [...document.querySelectorAll(".slider3d_wrap > div")];

    let angle = 0;
    const speed = 0.3;
    let dragging = false;
    let prevY;
    let width;

    let direction = 1;
    let prevAngle = angle;

    const maxSpeed = 4.3;
    const increasedMaxSpeed = maxSpeed * 1.5;
    const speedFactor = 1;

    let prevTime = Date.now();

    const onMouseDown = (e) => {
        dragging = true;
        prevY = e.clientY;
        prevTime = Date.now();
        e.preventDefault();
    };

    const onMouseMove = (e) => {
        if (dragging) {
            const diff = e.clientY - prevY;
            const offset = diff / width;
            direction = offset > 0 ? 1 : -1;

            let spd = offset * (360 / items.length) * speedFactor;
            spd = Math.min(Math.max(spd, -increasedMaxSpeed), increasedMaxSpeed);
            angle += spd;

            document.querySelector(
                ".slider3d_wrap"
            ).style.transform = `translateZ(-401.363px) rotateY(${angle}deg)`;

            const currentTime = Date.now();
            currentSpeed = Math.abs(
                (e.clientY - prevY) / (currentTime - prevTime)
            );

            prevTime = currentTime;
            prevY = e.clientY;
        }
    };

    function updateStyles() {
        const all = items.length;
        const step = 360 / all;

        const centerAngle = normalizeAngle(angle);

        for (let i = 0; i < all; i++) {
            const ang = normalizeAngle(i * step + centerAngle);
            const angDiff = Math.abs(ang) > 180 ? 360 - Math.abs(ang) : Math.abs(ang);

            const cuboid = items[i];
            const cuboidSide = cuboid.querySelector(".cuboid__side:nth-of-type(5)");

            const opacity = Math.max(0.9 - angDiff / 180, 0.2);

            if (cuboidSide) {
                cuboidSide.style.opacity = opacity;
                cuboidSide.style.filter = `brightness(${opacity})`;
            }
        }
    }

    const onMouseUpOrLeave = () => {
        dragging = false;
        const wrap = document.querySelector(".slider3d_wrap");
        wrap.style.transition = "transform 0.4s ease-out";
        updateStyles();
    };

    function rotate() {
        angle += speed * direction;

        document.querySelector(
            ".slider3d_wrap"
        ).style.transform = `translateZ(-401.363px) rotateY(${angle}deg)`;

        requestAnimationFrame(rotate);
    }

    rotate();

    const slider = document.querySelector(".slider3d");
    slider.addEventListener("mousedown", onMouseDown);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUpOrLeave);
    document.addEventListener("mouseleave", onMouseUpOrLeave);

    function create3dSlider() {
        const wrap = document.querySelector(".slider3d_wrap");
        const all = wrap.children.length;
        const gCS = window.getComputedStyle(document.querySelector(".slider3d"));
        const w = parseInt(gCS.width);
        width = w / all;
        const r = (w / (2 * Math.tan(Math.PI / all))) * 0.35;
        const step = 360 / all;

        for (let i = 0; i < all; i++) {
            const rad = (i * step * Math.PI) / 180;
            wrap.children[i].style.transform = `translate3d(${
                r * Math.sin(rad)
            }px, 0, ${r * Math.cos(rad)}px) rotateY(${i * step}deg)`;
        }

        nav(0);
    }

    create3dSlider();
});