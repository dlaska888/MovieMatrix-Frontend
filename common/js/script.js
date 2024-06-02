const preloader = document.querySelector(".preloader");

const fadeEffect = () => {
	if (!preloader.style.opacity) {
		preloader.style.opacity = 1;
	}
	if (preloader.style.opacity > 0) {
		preloader.style.opacity -= 0.1;
	} else {
		clearInterval(fadeEffectInterval);
	}
};

const fadeEffectInterval = setInterval(fadeEffect, 100);

window.addEventListener("load", { handleEvent: fadeEffect });
