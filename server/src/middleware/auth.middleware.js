import { supabaseAdmin } from "../config/database.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Missing or invalid token",
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error) {
      return res.status(401).json({
        error: "Unauthorized",
        message: error.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User not found",
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      raw: user,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication failed",
    });
  }
};
