require("dotenv").config();
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const supabase = require("../db");

exports.getDashboard = async (req, res) => {
  try {
    const { data: customers, error } = await supabase
      .from("customer")
      .select("price, type , date");

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

    const incomeByYearMap = {};

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

      if (customer.date) {
        const price = Number(customer.price || 0);
        const year = new Date(customer.date).getFullYear();

        if (!incomeByYearMap[year]) {
          incomeByYearMap[year] = 0;
        }
        incomeByYearMap[year] += price;
      }
    }

    const incomeByYear = Object.keys(incomeByYearMap)
      .sort()
      .map((year) => ({
        year,
        total: incomeByYearMap[year],
      }));

    // ส่ง response
    res.json({
      message: "Welcome to the dashboard",
      income,
      count_job,
      type_all,
      incomeByYear,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

exports.getDisplay = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("customer")
      .select("id, name, price, place, type, date, province, link_drive")
      .order("date", { ascending: false });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

exports.addCustomer = async (req, res) => {
  try {
    const { name, price, place, type, date, province, link_drive } = req.body;

    // ตรวจสอบข้อมูลที่ต้องมี
    if (!name || !price || !place || !type || !date || !province) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    // เพิ่มข้อมูลลงใน Supabase
    const { data, error } = await supabase.from("customer").insert([
      {
        name,
        price,
        place,
        type,
        date,
        province,
        link_drive: link_drive || "", // เผื่อว่าง
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      return res
        .status(500)
        .json({ message: error.message || "ไม่สามารถเพิ่มข้อมูลได้" });
    }

    return res.status(201).json({ message: "เพิ่มงานสำเร็จ", data });
  } catch (error) {
    console.error("Add customer error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const { name, price, place, type, date, province, link_drive } = req.body;

    // ตรวจสอบว่าข้อมูลที่ต้องการแก้ไขมีครบหรือไม่
    if (!name || !price || !place || !type || !date || !province) {
      console.log("Missing required fields.");
      return res.status(400).json({ message: "Missing required fields." });
    }

    // อัปเดตข้อมูลใน Supabase
    const { data, error } = await supabase
      .from("customer")
      .update({
        name,
        price,
        place,
        type,
        date,
        province,
        link_drive,
      })
      .eq("id", customerId)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      return res.status(500).json({ message: "Failed to update customer." });
    }

    res.json({ message: "Customer updated successfully.", data });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required." });
    }

    const { error } = await supabase
      .from("customer")
      .delete()
      .eq("id", customerId);

    if (error) {
      console.error("Supabase delete error:", error);
      return res.status(500).json({ message: "Failed to delete customer." });
    }

    res.json({ message: "Customer deleted successfully." });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

exports.getCustomerCountByProvince = async (req, res) => {
  try {
    const { data, error } = await supabase.from("customer").select("province");

    if (error) throw new Error(error.message);

    const provinceCounts = {};

    for (const record of data) {
      const province = record.province || "ไม่ระบุ";
      if (!provinceCounts[province]) {
        provinceCounts[province] = 0;
      }
      provinceCounts[province]++;
    }

    // แปลงเป็น array เพื่อส่งกลับ
    const result = Object.entries(provinceCounts).map(([province, count]) => ({
      province,
      count,
    }));

    res.json({
      message: "User count by province",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};
