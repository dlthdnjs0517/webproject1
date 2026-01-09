const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const menus = [
  {
    id: "about",
    title: "기업소개",
    role: ["all"],
    links: [
      { label: "CEO 인삿말", to: "/greeting" },
      { label: "회사연혁", to: "/history" },
      { label: "기업이념", to: "/philosophy" },
      { label: "조직도", to: "/orgChart" },
    ],
  },
  {
    id: "rnd",
    title: "R&D",
    role: ["all"],
    links: [
      { label: "연구분야", to: "/research" },
      { label: "개발성과", to: "/development" },
      { label: "연구소 소개", to: "/lab" },
      { label: "보도자료", to: "/news" },
    ],
  },
  {
    id: "iteminfo",
    title: "제품정보",
    role: ["all"],
    links: [
      { label: "일반의약품", to: "/otc" },
      { label: "전문의약품", to: "/prescription" },
      { label: "의약외품", to: "/quasi-drug" },
      { label: "건강기능식품", to: "/supplements" },
    ],
  },
  {
    id: "hr",
    title: "인재채용",
    role: ["all"],
    links: [
      { label: "인재상", to: "/talent" },
      { label: "직무소개", to: "/jobs" },
      { label: "인재채용근황", to: "/status" },
      { label: "복리후생", to: "/benefits" },
    ],
  },
  {
    id: "support",
    title: "고객지원",
    role: ["all"],
    to: "/support",
  },
  {
    id: "items",
    title: "아이템 도감",
    role: ["admin", "character"],
    to: "/items",
  },
];

router.get("/", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  let role = "guest";

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      role = decoded.role || "guest";
    } catch (err) {
      //토큰이 유효하지 않으면 그냥 "guest"
    }
  }
  // role에 따라 메뉴 필터링
  const filteredMenus = menus.filter((menu) => {
    return menu.role.includes("all") || menu.role.includes(role);
  });

  // 필터링된 메뉴를 JSON으로 응답
  try {
    res.json(filteredMenus);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "메뉴를 가져올 수 없음." });
  }
});

module.exports = router;
