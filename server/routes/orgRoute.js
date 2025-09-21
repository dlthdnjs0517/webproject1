const express = require("express");
const router = express.Router(); //라우터 객체를 생성(메인이 아닌 하위 요소)
const path = require("path");

const departments = require("../constants/departments");
const Employee = require("../models/Employee");
const mappingFields = require("../utils/mappingFields");
const tableFields = require("../constants/tableFields");

router.get("/", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json({ departments, employees });
  } catch (err) {
    res.status(500).json({ err: "직원 목록 조회 실패" });
  }
});

router.post("/addEmployee", async (req, res) => {
  try {
    const { name, department, position, email, assignedTask } = req.body;
    await new Employee({
      name,
      department,
      position,
      email,
      assignedTask,
    }).save();
    res.status(201).json({ message: "직원 추가 완료" });
  } catch (err) {
    console.error(err);
    res.status(500).json("직원 데이터 추가 중 오류가 발생했습니다!");
  }
});

router.get("/searchEmployee", async (req, res) => {
  try {
    const keyword = req.query.query;
    const search = await Employee.find({
      name: { $regex: keyword },
    });
    // console.log("✅ 검색 결과:", search);
    // res.json(search);
    // --> search 객체를 자동으로 JSON 문자열로 바꿔서 브라우저나 프론트에 보내줌.
    //사람한테 보여준다 : res.render() 코드한테 보내준다 res.json()
    const rawFields = Object.keys(Employee.schema.paths);
    //object.keys는 key값만 배열로 return하는 메서드
    const fieldNames = rawFields.filter(
      (field) => !["_id", "__v"].includes(field)
    );
    res.json({
      tableFields,
      search,
      fieldNames,
      keyword,
      departments,
      title: "(주)백일몽-조직도",
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
//작성된 라우터 객체를 저장해서 내보내는 역할을 한다. 바깥에서 사용할 수 있도록
