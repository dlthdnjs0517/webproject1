const header = document.querySelector('header');
const headerLogo = document.querySelector('header h1 img');
const headerInner = document.querySelector('.header-inner');
const subMenus = document.querySelectorAll(".gnb-title .sub");
const headerbg = document.querySelector(".headerbg");


// gnb.addEventListener('mouseenter', () => {
// 	headerbg.style.opacity = "1";
// 	headerbg.style.height = "400px";  // 메뉴 높이에 맞게 설정
// 	headerbg.style.zIndex = "1";
// });

// gnb.addEventListener('mouseleave', () => {
// 	headerbg.style.opacity = "0";
// 	headerbg.style.height = "0px";
// 	headerbg.style.zIndex = "-2";
// });


// gnb.addEventListener('mouseenter', () => {
// 	// 배경 펼치기
// 	headerbg.style.opacity = "1";
// 	headerbg.style.height = "200px";
// 	headerbg.style.zIndex = "1";

// 	// 모든 sub 메뉴 보여주기
// 	subMenus.forEach(sub => {
// 		sub.style.opacity = "1";
// 		sub.style.visibility = "visible";
// 		sub.style.zIndex = "2";
// 	});
// });

// gnb.addEventListener('mouseleave', () => {
// 	// 배경 접기
// 	headerbg.style.opacity = "0";
// 	headerbg.style.height = "0px";
// 	headerbg.style.zIndex = "-2";

// 	// 모든 sub 메뉴 숨기기
// 	subMenus.forEach(sub => {
// 		sub.style.opacity = "0";
// 		sub.style.visibility = "hidden";
// 	});
// });
// headerHov.addEventListener('mouseenter', () => {
// 	headerHov.classList.add('active');
// });
// headerHov.addEventListener('mouseleave', () => {
// 	headerHov.classList.remove('active');
// });
// header.addEventListener('mouseleave', () => {
// 	header.classList.remove('active');
// });
header.addEventListener('mouseenter', function () {
	if (headerInner) {
		headerInner.classList.add('active');
	}
	if (subMenus) {
		subMenus.style.display = 'block';
		subMenus.style.opacity = 0;
		let opacity = 0;
		const fadeInInterval - setInterval(function () {
			if (opacity < 1) {
				opacity += 0.1;
				subMenus.style.opacity = opacity;
			} else {
				clearInterval(fadeInInterval);
			}
		}, 30);
	}
	this.classList.add('active');
	if (headerbg) {
		headerbg.classList.add('active');
	}
});

header.addEventListener('mouseleave', function () {
	headerLogo.setAttribute('src', originalLogoSrc);
	this.classList.remove('active');
	if (headerbg) {
		headerbg.classList.remove('active');
	}
	// Hide subMenus immediately on mouse leave as in the original jQuery
	if (subMenus) {
		subMenus.style.display = 'none';
	}
});

// 230705 Accessibility work (Keyup event)
header.addEventListener('keyup', function (e) {
	// Check if the pressed key is Tab (keyCode 9)
	if (e.keyCode === 9) {
		headerLogo.setAttribute('src', '/common/images/main/hover_logo.png');
		// Check if headerInner exists before trying to add a class
		if (headerInner) {
			headerInner.classList.add('active');
		}
		// Simple fade-in approximation for subMenus
		if (subMenus) {
			subMenus.style.display = 'block';
			subMenus.style.opacity = 0;
			let opacity = 0;
			const fadeInInterval = setInterval(function () {
				if (opacity < 1) {
					opacity += 0.1; // Adjust increment for speed
					subMenus.style.opacity = opacity;
				} else {
					clearInterval(fadeInInterval);
				}
			}, 30); // Adjust interval for speed
		}
		this.classList.add('active');
		if (headerbg) {
			headerbg.classList.add('active');
		}
	}
});

// Focusout event
header.addEventListener('focusout', function () {
	// The original jQuery had commented out code here.
	// If you need specific focusout behavior on the last link,
	// you would need to add a separate event listener for that element.

	// Revert logo and remove classes
	headerLogo.setAttribute('src', originalLogoSrc);
	this.classList.remove('active');
	if (headerbg) {
		headerbg.classList.remove('active');
	}
	// Hide subMenus immediately on focus out
	if (subMenus) {
		subMenus.style.display = 'none';
	}
});


