const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");

const createIntern = async function (req, res) {
  try {
    const internDetail = req.body;
    const validEmail = /^\w+([\.-]?\w+)*@[a-z]\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const validName = /^[A-Za-z ]+$/;
    const validMobile = /^[6-9][0-9]{9}$/;
    //Validations
    if (Object.keys(internDetail).length === 0) {
      return res.status(400).send({ status: false, message: "Please provide intern details" });
    }
    const filteredInternDetail = {};

    const { name, email, mobile, collegeName } = internDetail;

    if (!name) {
      return res.status(400).send({
        status: false,
        message: "Please enter name",
      });
    }
    if(typeof name !== "string" || name.trim().length === 0){
      return res.status(400).send({
        status: false,
        message: "Type must be string",
      });
    }
    if (!validName.test(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid name without digits and special characters" });
    }
    
    filteredInternDetail.name = name.trim();
    if (!email) {
      return res.status(400).send({
        status: false,
        message: "Please enter name",
      });
    }
    if(typeof email !== "string" || email.trim().length === 0){
      return res.status(400).send({
        status: false,
        message: "Type must be string",
      });
    }
    if (!validEmail.test(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid name without digits and special characters" });
    }
    filteredInternDetail.email = email.trim();
    if (!mobile) {
      return res.status(400).send({
        status: false,
        message: "Please enter mobile number",
      });
    }
    if(typeof mobile !== "string" || mobile.trim().length === 0){
      return res.status(400).send({
        status: false,
        message: "Please Enter valid mobile no",
      });
    }
    if (!validMobile.test(mobile)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid mobile number" });
    }
    filteredInternDetail.mobile = mobile.trim();

    if (
      !collegeName
    ) {
      return res.status(400).send({
        status: false,
        message: "Please enter college name",
      });
    }
    if(
      typeof collegeName !== "string" ||
      collegeName.trim().length === 0){
        return res.status(400).send({
          status: false,
          message: "Type must be string",
        });
      }
    if (!validName.test(collegeName)) {
      return res.status(400).send({
        status: false,
        message:
          "Please enter valid college name without any special character or digit",
      });
    }
    // fetch collegeId by collegeName given in request body
    const isCollegeExist = await collegeModel.findOne({
      name: collegeName.trim(),
      isDeleted: false,
    });
    if (!isCollegeExist) {
      return res
        .status(404)
        .send({ status: false, message: "college not found" });
    } else {
      filteredInternDetail.collegeId = isCollegeExist._id;
    }

    const isEmailAlredayExist = await internModel.findOne({ email: email });
    if (isEmailAlredayExist) {
      return res
        .status(400)
        .send({ status: false, message: "email already registered" });
    }
    const ismobileAlredayExist = await internModel.findOne({
      mobile: filteredInternDetail.mobile,
    });
    if (ismobileAlredayExist) {
      return res
        .status(400)
        .send({ status: false, message: "mobile already registered" });
    }
    // Registring Intern with details given in req body along with collegeId
    const interndata = await internModel.create(filteredInternDetail);
    return res.status(201).send({ status: true, data: interndata });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.createIntern = createIntern;
