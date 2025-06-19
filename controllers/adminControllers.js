require("dotenv").config();
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const supabase = require("../db");

exports.getDashboard = async (req, res) => {
  try {
    const { data: customers, error } = await supabase
      .from("customer")
      .select("price, type");

    if (error) {
      throw new Error(error.message);
    }

    // คำนวณ
    let income = 0;
    let count_job = customers.length;

    // เก็บ count แต่ละประเภท
    const type_all = {
      graduate: 0,
      wedding: 0,
      profile: 0,
      event: 0,
      other: 0,
    };

    for (const customer of customers) {
      // รวม income
      income += Number(customer.price || 0);

      // เช็คประเภท type แล้วเพิ่ม count
      switch (customer.type) {
        case "ถ่ายรับปริญญา":
          type_all.graduate++;
          break;
        case "ถ่ายงานแต่ง":
          type_all.wedding++;
          break;
        case "ถ่ายโปรไฟล์":
          type_all.profile++;
          break;
        case "ถ่ายอีเว้นท์":
          type_all.event++;
          break;
        case "ถ่ายอื่นๆ":
          type_all.other++;
          break;
        default:
          break;
      }
    }

    // ส่ง response
    res.json({
      message: "Welcome to the dashboard",
      income,
      count_job,
      type_all,
    });

  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};
