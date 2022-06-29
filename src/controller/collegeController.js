const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")
const createCollege = async function(req,res){
    try{
        const collegeDetails = req.body;
        const newCollege = await collegeModel.create(collegeDetails);
        res.status(201).send({status: true, data: {newCollege}})
    }
catch(err){
    res.status(500).send({status:false,err:err.message})

}
}

const getCollegeWithInterns = async function(req,res){
    try{
        const collegeAbrv = req.query;
       if(Object.keys(collegeAbrv).length===0 || !collegeAbrv.name){
        return res.status(400).send({status: false, msg: 'Please select name'})
       } 
        const validCollegeAbbrviation = collegeAbrv["name"].trim();
        console.log(validCollegeAbbrviation)
 const college = await collegeModel.findOne({name: validCollegeAbbrviation}).select({name: 1, fullName: 1,logoLink: 1});
 console.log(college)
 if(!college){
    return res.status(404).send({status: false, msg: "College not found"})
 }
 const interns = await internModel.find({collegeId: college._id}).select({_id: 1,name: 1,email: 1,mobile: 1})
 console.log(interns)
 if(interns.length === 0){
    return res.status(404).send({status: false, msg: "interns with given college id not found"})
 }
 let collegeDetail = {name: college.name, fullName: college.fullName,logoLink: college.logoLink, interns: interns }
   return res.status(200).send({status: true, data: collegeDetail})
     }

    catch(err){
       return res.status(500).send({status: false, msg: err.message})
    }
}

module.exports.createCollege = createCollege
module.exports.getCollegeWithInterns = getCollegeWithInterns