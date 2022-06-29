const internModel = require("../models/internModel");

const createIntern = async function (req, res) {
  try {
    const internDetail = req.body;
    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const validName = /^[A-Za-z ]+$/;
    if (Object.keys(internDetail).length === 0) {
      return res.status(400).send({ status: false, msg: "Please provide intern details" });
    }
    if (!internDetail.name) {
      return res.status(400).send({ status: false, msg: "name is required" });
    }
    if (typeof internDetail.name !== "string") {
      return res.status(400).send({ status: false, msg: "Please enter valid name" });
    }
    //    let internName=internDetail.name
    //    let name=Name.trim()

    //    if(name!=Name){
    //    return res.status(400).send({status:false, msg:"space not allowed"})
    //    }
    if (!internDetail.email) {
      return res.status(400).send({ status: false, msg: "email is required" });
    }

    const email = internDetail.email;
    if (!validEmail.test(email)) {
      return res.status(400).send({ status: false, msg: "enter valid email id" });
    }
    if (!internDetail.mobile) {
      return res.status(400).send({ status: false, msg: "mobile number is required" });
    }
    //    const mobile =internDetail.mobile
    //    if(!(/^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/.test(mobile))){
    //    return res.status(400).send({status:false,msg:"valid mobile number"})
    //    }

    const isEmailAlredayExist = await internModel.findOne({ email: email });
    if (isEmailAlredayExist) {
      return res.status(400).send({ status: false, msg: "email already registered" });
    }

    const interndata = await internModel.create(internDetail);
    return res.status(201).send({ status: true, data: interndata });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.createIntern = createIntern;
