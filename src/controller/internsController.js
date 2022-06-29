const InterModel = require("../models/internModel")


const  createIntern= async function(req,res){
    try{
    const data= req.body
    if(Object.keys(data).length===0){
        res.status(400).send({status:false, message:"body couldnot empty"})
    }
    if(!data.name){
        res.status(400).send({status:false, message:"name is required"})
    }
    if(typeof data.name != "string"){
        res.status(400).send({status:false, message:"name is the string require"})
    }
   let Name=data.name
   let name=Name.trim()
  

   if(name!=Name){
    res.status(400).send({status:false, message:"space not allowed"})
   }
   if(!data.email){
    res.status(400).send({status:false, message:"email is require"})
   }
 

   const email=data.email
   if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
    res.status(400).send({status:false, message:"enter valid email id"})
   }
   if(!data. mobile){
    res.status(400).send({status:false, message:"mobile number must be present"})
   }
 
   
   
  
  const IsemailAlredayused= await InterModel.findOne({email:email});
  if(IsemailAlredayused){
    res.status(400).send({status:false, message:"email already registered"})
    
  }
       
     const interndata= await InterModel.create(data)
     res.status(201).send({status:true, data:interndata})

}
   catch(err){
    res.status(500).send({status:false,message:err.message})

   }
}

module.exports.createIntern=createIntern
