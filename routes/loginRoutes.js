const express =require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.post('/register', async(req,res)=>{
    const user = new User(req.body);

    try{
        await user.save();
        console.log(user.nameSurname);
        console.log(user.email);
        console.log(user.password);
        res.redirect('/login');
    }catch(error){
        if(error.code === 11000){
            return res.status(404).send('kullanıcı adı veya email mevcut');
        }
        console.log(req.body); // req.body'nin içeriğini kontrol edin

        return res.status(500).send('sunucu çöktü')
    }
})

router.post('/login', async (req,res)=>{
    const { _id, nameSurname, email, password} = req.body

    try{
        const user = await User.findOne({ nameSurname, email });
        if(!user){
            return res.status(404).json({id: 'error-message' ,message: 'KULLANICI BULUNAMADI'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(404).send('ŞİFRE YANLIŞ');
        }
        

        return res.redirect('/blogs');
    } catch(error){
        console.log(error);
        return res.status(500).send('SUNUCU HATASI');
    }
} );


module.exports = router;
