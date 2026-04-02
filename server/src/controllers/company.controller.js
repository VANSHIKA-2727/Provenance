import * as companyService from "../services/internal/company.service.js";

export const createCompany = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const existing = await companyService.getCompanyById(userId);
    if (existing) {
      return res.status(409).json({
        message: "Company already exists. Use update instead.",
      });
    }

    const { company_name, gst_number, Pibo_category } = req.body;

    if (!company_name) {
      return res.status(400).json({ message: "company_name is required" });
    }

    const company = await companyService.createCompany(userId, {
      company_name,
      gst_number,
      Pibo_category,
      email_id: req.user.email,
    });

    return res.status(201).json(company);
  } catch (err) {
    next(err);
  }
};

export const updateCompany = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const updates = req.body;

    const company = await companyService.updateCompany(userId, updates);

    if (!company) {
      return res.status(404).json({
        message: "Company not found. Complete onboarding first.",
      });
    }

    return res.json(company);
  } catch (err) {
    next(err);
  }
};

export const getMyCompany = async (req, res, next) => {
  try {
    const company = await companyService.getCompanyById(req.user.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found. Complete onboarding first.",
      });
    }

    return res.json(company);
  } catch (err) {
    next(err);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const company = await companyService.getCompanyById(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.json(company);
  } catch (err) {
    next(err);
  }
};
