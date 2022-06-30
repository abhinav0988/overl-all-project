const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");

const createIntern = async function (req, res) {
  try {
    const internDetail = req.body;
    const validEmail = /^\w+([\.-]?\w+)*@[a-z]\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const validName = /^[A-Za-z ]+$/;
    
    const validMobile=/^[6-9][0-9]{9}$/
    if (Object.keys(internDetail).length === 0) {
      return res.status(400).send({ status: false, message: "Please provide intern details" });
    }
    const data={}

    const {name ,email ,mobile ,collegeName}=internDetail;

    if (!name || typeof (name) !== "string"||name.trim().length===0) {
      return res.status(400).send({ status: false, message: "name is required and type must be string" });
    }else{data.name=name.trim()}

    if (!validName.test(name)) {
      return res.status(400).send({ status: false, message: "Please enter valid name " });
    }
   

    if (!email||typeof (email)!=="string"||email.trim().length===0) {
      return res.status(400).send({ status: false, message: "email is required and type must be string" });
    }else{data.email=email.trim()}

    if (!validEmail.test(email)) {
      return res.status(400).send({ status: false, message: "enter valid email id" });
    }

    if (!mobile||typeof (mobile)!=="string"||mobile.trim().length===0) {
      return res
        .status(400)
        .send({ status: false, message: "mobile number is required and type must be string" });
    }else{data.mobile=mobile.trim()}
 
    if(!validMobile.test(mobile)){
        return res.status(400).send({status:false,message:"Please enter valid mobile number"})
    }

    if(!collegeName||typeof (collegeName) !=="string" ||collegeName.trim().length===0){
      return res.status(400).send({ status: false, message: "college name is required and type must be string" });
    }else if(!validName.test(collegeName)){
      return res.status(400).send({ status: false, message: "Please enter valid college name without andy special character" });

    }else{
      const isCollegeExist = await collegeModel.findOne({name:collegeName,isDeleted:false});
        if(!isCollegeExist){
            return res.status(404).send({status: false, message: "college not found"})
        }else{data.collegeId = isCollegeExist._id;
        } 
      }       
    
  
    const isEmailAlredayExist = await internModel.findOne({ email: email });
    if (isEmailAlredayExist) {
      return res
        .status(400)
        .send({ status: false, message: "email already registered" });
    }
    const ismobileAlredayExist = await internModel.findOne({ mobile: data.mobile });
    if (ismobileAlredayExist) {
      return res
        .status(400)
        .send({ status: false, message: "mobile already registered" });
    }

    
    const interndata = await internModel.create(data);
    return res.status(201).send({ status: true, data: interndata });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.createIntern = createIntern;
