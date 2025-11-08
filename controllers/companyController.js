const Company = require("../models/company");

exports.addCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getCompanies = async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
};