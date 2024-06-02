const mongoose = require("mongoose");

const habitSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true,
    },
    repeatMode:{
        type:String,
        enum:["diario","semanal"],
        default:"diario"
    },
    reminder:{
        type:Boolean,
        default:false,
    },
    completed:{
        type:Object,
        default:{}
    },
    createdAT:{
        type:Date,
        default:Date.now
    }
});

const Habit = mongoose.model("Habit",habitSchema);

module.exports = Habit

