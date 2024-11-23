const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const userSchema= new Schema({

    nameSurname:{
        type:String,
        reyuquired: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});

userSchema.pre('save', async function (next){
    const user = this;
    if(!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next()
})


const User = mongoose.model('User', userSchema);
module.exports = User;



