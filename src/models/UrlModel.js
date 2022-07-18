const mongoose =require('mongoose');
const urlSchema = new mongoose.Schema({
    urlCode: { 
        type:String, 
        unique:true,
        required:true,
        trim:true
         }, 

    longUrl: {
        type:String,
        required:true,
        trim:true 
    },

    shortUrl: {
        type:String,
        required:true,
         unique:true,
         trim:true
        }

},{timestamps:true});

module.exports= mongoose.model('urlShortener',urlSchema)