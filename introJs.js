
const gnb = document.querySelector(".gnb");
const headerBg = document.querySelector(".headerbg");
const subMenus = document.querySelectorAll(".sub");
const headerHov = document.querySelector(".headerhov");
const header = document.querySelector("header");

gnb.addEventListener('mouseenter', () => {
	headerBg.style.opacity = "1";
	headerBg.style.height = "400px";  // 메뉴 높이에 맞게 설정
	headerBg.style.zIndex = "1";
});

gnb.addEventListener('mouseleave', () => {
	headerBg.style.opacity = "0";
	headerBg.style.height = "0px";
	headerBg.style.zIndex = "-2";
});


gnb.addEventListener('mouseenter', () => {
	// 배경 펼치기
	headerBg.style.opacity = "1";
	headerBg.style.height = "200px";
	headerBg.style.zIndex = "1";

	// 모든 sub 메뉴 보여주기
	subMenus.forEach(sub => {
		sub.style.opacity = "1";
		sub.style.visibility = "visible";
		sub.style.zIndex = "2";
	});
});

gnb.addEventListener('mouseleave', () => {
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

headerHov.addEventListener('mouseenter', () => {
	headerHov.classList.add('active');
});
headerHov.addEventListener('mouseleave', () => {
	headerHov.classList.remove('active');
});
header.addEventListener('mouseenter', () => {
	header.classList.add('active');
});
headerHov.addEventListener('mouseleave', () => {
	header.classList.remove('active');
});

