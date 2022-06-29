const InterModel = require("../models/internModel")


const  createIntern= async function(req,res){
    try{
    const data= req.body
    if(Object.keys(data).length===0){
        res.status(400).send({status:false,msg:"body couldnot empty"})
    }
    if(!data.name){
        res.status(400).send({status:false,msg:"name is required"})
    }
    if(typeof data.name != "string"){
        res.status(400).send({status:false,msg:"name is the string require"})
    }
   let Name=data.name
   let name=Name.trim()
  

   if(name!=Name){
    res.status(400).send({status:false, msg:"space not allowed"})
   }
   if(!data.email){
    res.status(400).send({status:false,msg:"email is require"})
   }
 

   const email=data.email
   if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
    res.status(400).send({status:false,msg:"enter valid email id"})
   }
   if(!data. mobile){
    res.status(400).send({status:false,msg:"mobile number must be present"})
   }
   const mobile=data.mobile
   const mobileNumberAlready= await InterModel.findOne({mobile:mobile})
   if(mobileNumberAlready){
    res.status(400).send({status:false,msg:"mobile number already register"})
   }
   
   
  
  const IsemailAlredayused= await InterModel.findOne({email:email});
  if(IsemailAlredayused){
    res.status(400).send({status:false,msg:"email already registered"})
    
  }
       
     const interndata= await InterModel.create(data)
     res.status(201).send({status:true,data:interndata})

}
   catch(err){
    res.status(500).send({status:false,msg:err.message})

   }
}



module.exports.createIntern=createIntern
