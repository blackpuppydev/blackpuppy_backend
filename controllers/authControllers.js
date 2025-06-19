const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db");

const supabase = require("../db");

const login = async (req, res) => {
  const { email, password } = req.body; // Supabase ใช้ email ในการล็อกอิน

  if (!email) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return res
        .status(400)
        .json({ message: error?.message || "Login failed" });
    }

    const { user } = data;

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role , full_name")
      .eq("id", user.id)
      .single();

    const role = profileData?.role || "user";
    const fullName = profileData?.full_name || "No name";


    return res.json({
      token: data.session.access_token,
      user: {
        id: user.id,
        email: user.email,
        name: fullName,
        role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Error logging in." });
  }
};

module.exports = { login };


