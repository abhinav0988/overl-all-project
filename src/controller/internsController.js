const internModel = require("../models/internModel");

const createIntern = async function (req, res) {
  try {
    const internDetail = req.body;
    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const validName = /^[A-Za-z ]+$/;
    const validMobile=/^[0-9]{10}$/
    if (Object.keys(internDetail).length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide intern details" });
    }
    const data={}

    const {name ,email ,mobile ,collegeId}=internDetail;

    if (!name || typeof (name) !== "string") {
      return res.status(400).send({ status: false, message: "name is required and type must be string" });
    }else{data.name=name.trim()}

    if (!validName.test(name)) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid name " });
    }

    if (!email||typeof (email)!=="string") {
      return res.status(400).send({ status: false, message: "email is required and type must be string" });
    }else{data.email=email.trim()}

    if (!validEmail.test(email)) {
      return res
        .status(400)
        .send({ status: false, message: "enter valid email id" });
    }

    if (!mobile||typeof (mobile)!=="string") {
      return res
        .status(400)
        .send({ status: false, message: "mobile number is required and type must be string" });
    }else{data.mobile=mobile.trim()}
 
    if(!validMobile.test(mobile)){
        return res.status(400).send({status:false,message:"valid mobile number"})
    }
    if(internDetail.isDeleted){
      data.isDeleted=internDetail.isDeleted
    }

    if(internDetail.collegeId){
      data.collegeId=internDetail.collegeId
    }

    const isEmailAlredayExist = await internModel.findOne({ email: email });
    if (isEmailAlredayExist) {
      return res
        .status(400)
        .send({ status: false, message: "email already registered" });
    }


    const interndata = await internModel.create(data);
    return res.status(201).send({ status: true, data: interndata });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.createIntern = createIntern;
