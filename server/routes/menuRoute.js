const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const menus = [
  {
    title: "기업소개",
    role: "all",
    links: [
      { label: "CEO 인삿말", to: "#" },
      { label: "회사연혁", to: "#" },
      { label: "기업이념", to: "#" },
      { label: "조직도", to: "/orgChart" },
    ],
  },
  {
    title: "R&D",
    role: "all",
    links: [
      { label: "연구분야", to: "#" },
      { label: "개발성과", to: "#" },
      { label: "연구소 소개", to: "#" },
      { label: "보도자료", to: "#" },
    ],
  },
  {
    title: "제품정보",
    role: "all",
    links: [
      { label: "일반의약품", to: "#" },
      { label: "전문의약품", to: "#" },
      { label: "의약외품", to: "#" },
      { label: "건강기능식품", to: "#" },
    ],
  },
  {
    title: "인재채용",
    role: "all",
    links: [
      { label: "인재상", to: "#" },
      { label: "직무소개", to: "#" },
      { label: "인재채용근황", to: "#" },
      { label: "복리후생", to: "#" },
    ],
  },
  {
    title: "고객지원",
    role: "all",
    links: [],
  },
  {
    title: "아이템 도감",
    role: ["admin", "character"],
    links: [],
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
  res.json(filteredMenus);
});

module.exports = router;
