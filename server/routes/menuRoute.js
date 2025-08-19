const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const menus = [
  {
    id: "about",
    title: "기업소개",
    role: ["all"],
    links: [
      { label: "CEO 인삿말", to: "#" },
      { label: "회사연혁", to: "#" },
      { label: "기업이념", to: "#" },
      { label: "조직도", to: "/orgChart" },
    ],
  },
  {
    id: "rnd",
    title: "R&D",
    role: ["all"],
    links: [
      { label: "연구분야", to: "#" },
      { label: "개발성과", to: "#" },
      { label: "연구소 소개", to: "#" },
      { label: "보도자료", to: "#" },
    ],
  },
  {
    id: "iteminfo",
    title: "제품정보",
    role: ["all"],
    links: [
      { label: "일반의약품", to: "#" },
      { label: "전문의약품", to: "#" },
      { label: "의약외품", to: "#" },
      { label: "건강기능식품", to: "#" },
    ],
  },
  {
    id: "hr",
    title: "인재채용",
    role: ["all"],
    links: [
      { label: "인재상", to: "#" },
      { label: "직무소개", to: "#" },
      { label: "인재채용근황", to: "#" },
      { label: "복리후생", to: "#" },
    ],
  },
  {
    id: "support",
    title: "고객지원",
    role: ["all"],
    to: "#",
  },
  {
    id: "items",
    title: "아이템 도감",
    role: ["admin", "character"],
    to: "#",
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
