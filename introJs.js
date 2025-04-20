// window.addEventListener('scroll', function () {
// 	const header = document.querySelector('header');
// 	if (window.scrollY > 50) {
// 		header.classList.add('fixed');
// 	} else {
// 		header.classList.remove('fixed');
// 	}
// });

const gnb = document.querySelector(".gnb");
const headerBg = document.querySelector(".headerbg");
const subMenus = document.querySelectorAll(".sub");

gnb.addEventListener("mouseenter", () => {
	headerBg.style.opacity = "1";
	headerBg.style.height = "200px";  // 메뉴 높이에 맞게 설정
	headerBg.style.zIndex = "1";
});

gnb.addEventListener("mouseleave", () => {
	headerBg.style.opacity = "0";
	headerBg.style.height = "0px";
	headerBg.style.zIndex = "-2";
});


gnb.addEventListener("mouseenter", () => {
	// 배경 펼치기
	headerBg.style.opacity = "1";
	headerBg.style.height = "200px";
	headerBg.style.zIndex = "1";

	// 모든 sub 메뉴 보여주기
	subMenus.forEach(sub => {
		sub.style.opacity = "1";
		sub.style.visibility = "visible";
	});
});

gnb.addEventListener("mouseleave", () => {
	// 배경 접기
	headerBg.style.opacity = "0";
	headerBg.style.height = "0px";
	headerBg.style.zIndex = "-2";

	// 모든 sub 메뉴 숨기기
	subMenus.forEach(sub => {
		sub.style.opacity = "0";
		sub.style.visibility = "hidden";
	});
});