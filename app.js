const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const authRouter = require('./routes/authRoutes');
const loginRouter = require('./routes/loginRoutes');
const blogRouter = require('./routes/blogRoutes');
// expressi  expresse atıyorum
app = express();

const dbURI = "mongodb://localhost:27017";
const connectToDb = async()=>{
    try {            // databaseye bağlandığım kod bloğu
        const result = await mongoose.connect(dbURI);
        app.listen(3000, ()=>{
            console.log('server is running on port 3000');
        });
    }catch (error){
        console.log('error connecting to database', error)
    };
}

connectToDb();
app.set('view engine', 'ejs'); // ejs şablon motorum
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true}));

app.get('/', (req,res)=>{
    res.render('login' ,{title: 'giriş yap'});
});

app.get('/login', (req,res)=>{
    res.render('login', {title: 'log-in'});
});

app.get('/register', (req,res)=>{
    res.render('register' ,{title: 'register'});
});

app.get('/about', (req,res)=>{
    res.render('about', {title: 'about'});
})

app.use(authRouter);
app.use(loginRouter);
app.use(blogRouter);