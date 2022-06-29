const collegeModel = require("../models/collegeModel");

var validateUrl = function (url) {
  var re = /^https?:\/\/.*\/.*\.(png|jpeg|jpg)\??.*$/gim;
  return re.test(url);
};

const createCollege = async function (req, res) {
  try {
    const collegeDetails = req.body;
    const data = {};
    if (!Object.keys(collegeDetails).length > 0) {
      return res.status(400).send({ status: false, message: "required some data" });
    }
    const { name, fullName, logoLink } = collegeDetails;

    let validName = /^[A-Za-z ]+$/;

    if (!name || typeof (name) !== "string") {
      return res.status(400).send({ status: false, message: "Name required and  type must be string" });
    } else {
      data.name = name.trim();
    }
    if (!validName.test(name)) {
      return res.status(400).send({ status: false, message: "Enter valid name" });
    }

    if (!fullName || typeof (fullName) !== "string") {
      return res.status(400).send({ status: false, message: "fullName required and type must be string" });
    } else {
      data.fullName = fullName.trim();
    }

    if (!logoLink || typeof (logoLink) !== "string") {
      return res.status(400).send({ status: false, message: "LogoLink required and type must be string" });
    } else {
      data.logoLink = logoLink.trim();
    }
    if (!validateUrl(logoLink)) {
      return res.status(400).send({ status: false, message: "Image url is not valid" });
    }
    
    if(collegeDetails.isDeleted){
      data.isDeleted=collegeDetails.isDeleted
    }

    const findCollege = await collegeModel.findOne({ name: data.name });

    if (findCollege) {
      return res.status(400).send({ status: false, message: "use different Name" });
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
    const validCollegeAbbrviation = collegeAbrv["name"].trim();
    const college = await collegeModel
      .findOne({ name: validCollegeAbbrviation })
      .select({ name: 1, fullName: 1, logoLink: 1 });
    console.log(college);
    if (!college) {
      return res.status(404).send({ status: false, message: "College not found" });
    }
    const interns = await internModel
      .find({ collegeId: college._id })
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
