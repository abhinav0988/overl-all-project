const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
var validateUrl = function (url) {
  var validlogoUrlregex = /^https?:\/\/.*\/.*\.(png|jpeg|jpg)\??.*$/gim;
  return validlogoUrlregex.test(url);
};
let validName = /^[A-Za-z]+$/;
const createCollege = async function (req, res) {
  try {
    const collegeDetails = req.body;
    const data = {};
    if (!Object.keys(collegeDetails).length > 0) {
      return res.status(400).send({ status: false, message: "required some data" });
    }
    const { name, fullName, logoLink } = collegeDetails;
    //let validName = /^[A-Z]\'?[- a-zA-Z]( [a-zA-Z])*$/
    if (typeof name === undefined || name === null) {
      return res.status(400).send({
        status: false,
        message: "Please Enter name",
      });
    }
    if (!name) {
      return res.status(400).send({
        status: false,
        message: "Please Enter name",
      });
    }
    if (
      typeof name !== "string" ||
      name.trim().length === 0 ||
      !validName.test(name)
    ) {
      return res.status(400).send({
        status: false,
        message: "Please enter valid name",
      });
    }
    data.name = name.trim().toLowerCase();

    if (!fullName) {
      return res.status(400).send({
        status: false,
        message: "Please Enter fullName",
      });
    }
    if (typeof fullName !== "string" || fullName.trim().length === 0) {
      return res.status(400).send({
        status: false,
        message: "Please enter valid name",
      });
    }
    data.fullName = fullName.trim();

    if (!logoLink) {
      return res.status(400).send({
        status: false,
        message: "Please Enter Logo link ",
      });
    }
    if (typeof logoLink !== "string" || logoLink.trim().length === 0) {
      return res.status(400).send({
        status: false,
        message: "Type must be string",
      });
    }
    if (!validateUrl(logoLink)) {
      return res.status(400).send({ status: false, message: "Image url is not valid" });
    }
    data.logoLink = logoLink.trim();

    if (collegeDetails.isDeleted) {
      data.isDeleted = collegeDetails.isDeleted;
    }

    const findCollege = await collegeModel.findOne({ name: data.name });
if (findCollege) {
      return res.status(400).send({ status: false, message: "College already exists" });
    }

    const newCollege = await collegeModel.create(data);
    return res.status(201).send({ status: true, data: newCollege });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

const getCollegeWithInterns = async function (req, res) {
  try {
    const collegeAbrv = req.query;
    if (Object.keys(collegeAbrv).length === 0 || !collegeAbrv.name) {
      return res.status(400).send({ status: false, message: "Please select name" });
    }
    if(!validName.test(collegeAbrv)){
      return res
        .status(400)
        .send({ status: false, message: "Please select valid name" });
    }
    const validCollegeAbbrviation = collegeAbrv["name"].trim();
    const college = await collegeModel
      .findOne({ name: validCollegeAbbrviation, isDeleted: false})
      .select({ name: 1, fullName: 1, logoLink: 1 });
    if (!college) {
      return res .status(404)
        .send({ status: false, message: "College not found" });
    }
    const interns = await internModel
      .find({ collegeId: college._id, isDeleted: false })
      .select({ _id: 1, name: 1, email: 1, mobile: 1 });

    if (interns.length === 0) {
      return res.status(404).send({
        status: false,
        message: "interns with given college id not found",
      });
    }
    let collegeDetail = {
      name: college.name,
      fullName: college.fullName,
      logoLink: college.logoLink,
      interns: interns,
    };
    return res.status(200).send({ status: true, data: collegeDetail });
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.createCollege = createCollege;
module.exports.getCollegeWithInterns = getCollegeWithInterns;
