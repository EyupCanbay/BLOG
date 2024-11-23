const express =require('express');
const User = require('../models/user');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
const { access } = require('fs');
const router = express();
require('dotenv').config();


router.set('view engine', 'ejs');
router.set('views', path.join(__dirname, 'views'));
router.use(express.static(path.join(__dirname, 'public')));
router.use(express.urlencoded({ extended: true}));
router.use(session({ secret: 'secret_key', resave: false, saveUninitialized: false}))
router.use(passport.initialize());
router.use(passport.session());





//! DATABASE
const dbURI = "mongodb://localhost:27017";
const connectToDb = async()=>{
    try {            // databaseye bağlandığım kod bloğu
        const result = await mongoose.connect(dbURI);
    }catch (error){
        console.log('error connecting to database', error)
    };
}


router.get('/auth/google',
    passport.authenticate('google', {scope: ['profile', 'email']})
);

router.get('/auth/google/callback', passport.authenticate('google',{failureRedirect: '/'}), (req,res) => {

    res.redirect('/blogs')
});

router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/');
});

//! GOOGLE AUTHENTİCATİON
passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
    }, async (accessToken, resreshToken, profile, done)=>{
        try { //! LOOKİNG FOR USER ON DATABASE   buraya geri dön mantık hatası var isim benzerliği olursa kullanıcı zaten var der
            let user = await User.findOne({ email: profile.emails[0].value });
            

            if(user) {
                done(null, user);
            } else {
                
                user = await new User({
                    nameSurname : profile.displayName,
                    email : profile.emails[0].value, // ilk eposta adresini almak için 0 diyoruz
                    password: '.' // kullanıcının şifresini alman lazım burdan
                }).save();

                console.log(profile.displayName);
                done(null,user);
            }
        }catch(error) {
            console.log(error);
            done(error, user)
        }
    }
    )
)


passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
    User.findById(id).then(user=>{
        done(null, user);
    });
});



module.exports = router;
