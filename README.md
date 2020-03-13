<h1 id='summary'>Summary</h1>

* [Follow-Up App](#followup)
  * [Basic Back-end](#basic)
    * [Installation](#installation)
    * [CSS and Initial Structure](#files)
      * [CSS Family Fonts](#fonts)
      * [Server Basic Structure](#serverstructure)
    * [Basic Server](#baiscserver)
    * [dotenv File](#dotenv)
    * [Database](#database)
      * [Database - Create Folder/Files](#createfoldersdata)
      * [User Schema](#userschema)
      * [Config Database Connection](#configdatabase)
      * [Connect Database to the Server](#connectdatabase)
    * [Config JWT Auth](#configauth)
      * [JWT Auth File](#jwtauth)
      * [Add JWT to User Schema](#addjwtuser)
      * [Config Users Controllers with JWT](#usercontroller)
    * [Routes](#routes)
      * [Create Routes Folders/Files](#createfolderroutes)
      * [User Routes](#usersroute)
      * [Request Routes](#requestsroute)
      * [Application Controller](#controllersapplications)
      * [Add API Routes to the Server](#serverapis)
    * [Server Structure](#serverstructure1)
    * [         ](#xxxxxxxx)

<h1 id='followup'>Follow-Up App</h1>

<h2 id='basic'>Basic Back-End</h2>

<h3 id='installation'>Installation</h3>

[Go Back to Summary](#summary)

```Bash
    npx create-react-app follow-up-app
    npm i redux react-redux redux-saga
    npm i express morgan serve-favicon mongoose dotenv bcrypt jsonwebtoken react-router-dom
    npm i @material-ui/core @material-ui/icons @material-ui/icons 
```

<h3 id='files'>CSS and Initial Structure</h3>

[Go Back to Summary](#summary)


<h4 id='fonts'>CSS Family Fonts</h4>

* Add to html file:

    ```html
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    ```

<h4 id='serverstructure'>Server Basic Structure</h4>

* Initial Structure
  
    ```Bash
        .
        ├── node_modules
        ├── public
        │   ├── faicon.ico
        │   ├── index.html
        │   └── robots.txt
        ├── src
        │   ├── App.css
        │   ├── App.js
        │   ├── App.test.js
        │   ├── index.css
        │   ├── index.js
        │   ├── serviceWorker.js
        │   └── setupTests.js
        ├── .env
        ├── package-lock.json
        ├── package.json
        ├── Procfile
        └── server.js
    ```

<h3 id='baiscserver'>Basic Server</h3>

[Go Back to Summary](#summary)

* In `server.js`
  * Let's config the basic server:

    ```JavaScript
        const express = require('express');
        const path = require('path');                                       //! Used to figure out where I am going to serve my html from
        const favicon = require('serve-favicon');                           //! Just the website icon
        const logger = require('morgan');                                   //! Morgan is used for logging request details

        const app = express();                                                  //+ Create express app

        //! Middleware
        app.use(logger('dev'));                                                 //+ Mount my loggger middleware       
        app.use(express.json());                                                //+ Mount my json midleware - to response as JSON requests
                                                                                    //- For React back-end, we dont need method-override because we don't have any forms to submit
        app.set('view engine', 'ejs');                                          //+ Use .ejs as the default view engine
        //! Configure both serve-favicon & static middlewares to serve from the production 'build' folder
        app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
        app.use(express.static(path.join(__dirname, 'build')));                 //+ looking for static assets, we are going to look into this folder (html file, css, image)
                                                                                    //- static files don't have any logic

        //! API Routes -  Put them before the "catch all" route - The following "catch all" route (note the *)is necessary for a SPA's client-side routing to properly work
        app.get('/*', function(req, res) {
            res.sendFile(path.join(__dirname, 'build', 'index.html'));
        });

        //! Configure to use port 3001 instead of 3000 during development to avoid collision with React's dev server
        const port = process.env.PORT || 3001;
        app.listen(port, function() {
            console.log(`Express app running on port ${port}`)
        });
    ```

<h3 id='dotenv'>dotenv File</h3>

[Go Back to Summary](#summary)

* In `.env`
  * Declare your secret variables

    ```JavaScript
        DATABASE_URL=mongodb://localhost/pennydb
        SECRET_JWT=roger-takeshita-secret
    ```
  * the `DATABASE_JWT` we're going to use to connect to our local database
  * the `SECRET_JWT` we're going to use later to encode/decode the token

<h3 id='database'>Database</h3>

[Go Back to Summary](#summary)

<h4 id='createfoldersdata'>Database - Create Folder/Files</h4>

```Bash
    touch models/user.js
    touch config/database.js
    touch config/auth.js
    touch controllers/users.js
    touch controllers/applications.js
```

<h4 id='userschema'>User Schema</h4>

* In `models/user.js`

    ```JavaScript
        const mongoose = require('mongoose');       //! Require mongoose
        const Schema = mongoose.Schema;             //! Shorthand for mongoose.schema (optional)

        //! User Schema
        const userSchema = new Schema(
            {
                firstName: {
                    type: String,
                    required: true
                },
                lastName: {
                    type: String,
                    required: true
                },
                email: {
                    type: String,
                    required: true
                },
                password: {
                    type: String,
                    required: true
                },
                admin: {
                    type: Boolean,
                    default: false
                },
                avatar: {
                    type: String
                },
                googleId: {
                    type: String
                }
            },
            {
                timestamps: true
            }
        );

        //! export mongoose module as User
        module.exports = mongoose.model('User', userSchema);
    ```

<h4 id='configdatabase'>Config Database Connection</h4>

* In `config/database.js`

    ```JavaScript
        const mongoose = require('mongoose');       //! Require mongoose
        const db = mongoose.connection;             //! Shorthand for mongoose.connection (optional)

        //! Connect to mongodb
        mongoose.connect(
            process.env.DATABASE_URL, { 
                useNewUrlParser: true, 
                useCreateIndex: true, 
                useUnifiedTopology: true 
            }
        );

        //! Check if it's connected
        db.once('connected', () => {
            console.log(`Connected to MongoDB ${db.name} at ${db.host}:${db.port}`);
        });
    ```

<h4 id='connectdatabase'>Connect Database to the Server</h4>

* In `server.js`
  * After `const logger = require ('morgan');` require first the dotenv file and after the database (because the database will need DATABASE_URL to connect)

    ```JavaScript
        const logger = require('morgan');                                   //! Morgan is used for logging request details
        require('dotenv').config();                                         //! Require dotenv module before the database, we need the dotenv path to load our database
        require('./config/database');                                       //! Require the database
    ```

<h3 id='configauth'>Config JWT Auth</h3>

[Go Back to Summary](#summary)

<h4 id='jwtauth'>JWT Auth File</h4>

* In `config/auth.js`
  * We are going to check if the token is valid - for every request

    ```JavaScript
        const jwt = require('jsonwebtoken');                                            //! Require jwt
        const SECRET = process.env.SECRET_JWT;                                          //! Get the encode/decode key

        module.exports = function(req, res, next) {
            let token = req.get('Authorization') || req.query.token || req.body.token;      //+ Get the token
            if (token) {                                                                    //+ If token exists
                token = token.replace('Baerer ', '');                                           //- Remove 'Baerer '
                jwt.verify(token, SECRET, function(err, decoded) {                              //- Decode the token
                    if (err) {                                                                      //? If error
                        next(err);                                                                      //> Call next() function
                    } else {                                                                        //? Else
                        req.user = decoded.user;                                                        //> If not error, orverride req.user with just the user information from token (in this case _id, firstName, lastName and email)
                        next();                                                                         //> Call next() function
                    }
                });
            } else {                                                                        //+ If token doesn't exist
                next();                                                                         //- Call next() function
            }
        };
    ```

<h4 id='addjwtuser'>Add JWT to User Schema</h4>

* In `models/user.js`
  * Let's Encrypt the password before saving and add a compare function to decrypt the password to check if it's valid
  * After `const Schema = mongoose.Schema;` add:
  
    ```JavaScript
        const Schema = mongoose.Schema;             //! Shorthand for mongoose.schema (optional)
        const bcrypt = require('bcrypt');           //! Require bycrypt
        const SALT_ROUNDS = 6;                      //! bcrypt has a setting that tells it how many times to randomize the generation of salt. Usually 6 is enough.
    ```

  * before `modules.export = mongoose.model('User', userScheam);` add:

    ```JavaScript
        //! Mongoose Middleware - Encrypt the password
        userSchema.pre('save', function(next) {                           //! pre middleware, also as known as 'hook'
            const user = this;                                                  //+ this will be set to the current user
            if (!user.isModified('password')) return next();                    //+ If the password hasn't changed, return call next() function
            bcrypt.hash(user.password, SALT_ROUNDS, function(err, hash) {       //+ If password has changed - salt and hash it. This is an async function, so we pass a function
                if (err) return next(err);                                          //- check if you got any error
                user.password = hash;                                               //- replace the user provided password with the hased password
                next();                                                             //- I need to call the next() function
            });
        });

        //! bcrypt includes a compare method for verifying that a cleartext password matches a given hash.
        userSchema.methods.comparePassword = function(tryPassword, cb) {
            bcrypt.compare(tryPassword, this.password, cb);
        };

        //! Remove the password property when serializing doc to JSON - In this case we are only sending back (_id, firstName, lastName, and email)
        userSchema.set('toJSON', {
            transform: function(doc, ret) {
                delete ret.password;
                delete ret.createdAt;
                delete ret.updatedAt;
                delete ret.admin;
                return ret;
            }
        });
    ```

<h4 id='usercontroller'>Config Users Controllers with JWT</h4>

* In `controllers/users.js` add:
  
    ```JavaScript
        const User = require('../models/user');                         //! Require the userl model
        const jwt = require('jsonwebtoken');                            //! Require JWT
        const SECRET = process.env.SECRET_JWT;                          //! Require the secret key

        function createJWT(user) {                                      //! Create a JWT Token valid for 24 for this specific user
            return jwt.sign({ user }, SECRET, { expiresIn: '24h' });
        }

        async function signup(req, res) {                                       //! Async Sign Up
            try {                                                                   //+ try/catch checks if the user already exists
                const user = await User.findOne({ email: req.body.email });             //- Find one user by email
                if (!user) {                                                            //- If user not found
                    const newUser = new User(req.body);                                     //? Create a new user object
                    try {                                                                   //? try/catch saves the new user
                        await newUser.save();                                                   //> Await for saving
                        const token = createJWT(newUser);                                       //> Create a new Token
                        res.json({ token });                                                    //> Response token to the sign up request
                    } catch (err) {                                                         //? If error
                        console.log(err);                                                       //> print
                        res.status(500).json({ err: 'Something went wrong' });                  //> Response error (500) - Internal error
                    }
                } else {                                                                //- If user exists
                    res.status(400).json({ err: 'Email already taken' });                   //? Response error (400) - Email already exists
                }
            } catch (err) {                                                         //+ If error
                res.status(500).json({ err: 'Something went wrong' });                  //- Response error(500) - Internal error
            }
        }

        async function login(req, res) {                                                //! Async Log In
            try {                                                                           //+ try/catch find one user
                const user = await User.findOne({ email: req.body.email });                     //- Find one user by email
                if (!user) return res.status(404).json({ err: "User doesn't exist!" });         //- If user doesn't exist, response error (404) - User doesn't exist
                user.comparePassword(req.body.password, (err, isMatch) => {                     //- If user exists, check the password with comparePassowrd function from User Schema
                    if (isMatch) {                                                                  //? If password match  
                        const token = createJWT(user);                                                  //> Create a new token
                        res.json({ token });                                                            //> Response the Token
                    } else {                                                                        //? If password doesn't match
                        return res.status(400).json({ err: 'Wrong password!' });                        //> Response error (400) - Wrong password
                    }
                });
            } catch (err) {                                                                 //+ If error
                res.status(500).json({ err: 'Something went wrong' });                          //- Response error (500) - Internal error
            }
        }

        module.exports = {
            signup,
            login
        };
    ```

<h3 id='routes'>Routes</h3>

[Go Back to Summary](#summary)

<h4 id='createfolderroutes'>Create Routes Folders/Files</h4>

```Bash
    touch routes/requests.js
    touch routes/users.js
```

  * `routes/users.js` we are going to use only for login/signup requests - dont need token
  * `routes/request.js` we are going to use this route for other requests - need token

<h4 id='usersroute'>User Routes</h4>

* In `routes/users.js` add:

    ```JavaScript
        const express = require('express');                     //! Require express
        const router = express.Router();                        //! Shorthand for exprss.Router() (optional)
        const usersCtrl = require('../controllers/users');      //! Require users controller

        //! Public routes
        router.post('/signup', usersCtrl.signup);                   //+ Sign up
        router.post('/login', usersCtrl.login);                     //+ Log In - Obs: we don't need a route for log out. We can simply delete the token from the localStorage (client side) - this way the client won't be authenticated anymore

        module.exports = router;
    ```

<h4 id='requestsroute'>Request Routes</h4>

* In `routes/requests.js` add:

    ```JavaScript
        const express = require('express');                                 //! Require express
        const router = express.Router();                                    //! Shorthand for express.Router() (optional)
        const applicationCtrl = require('../controllers/applications');     //! Require tue application controller

        //! Privet Routes
        router.use(require('../config/auth'));                              //! Request req.user
        router.get('/search/*', checkAuth, applicationCtrl.search);         //! Search for applications

        function checkAuth(req, res, next) {                                //! Helper function (middleware)
            if (req.user) return next();                                        //+ If user exist, call next() function
            return res.status(401).json({ msg: 'Not Authorized' });             //+ It user doesn't exist, reponse erro (401) - Not authorized
        }

        module.exports = router;
    ```

<h4 id='controllersapplications'>Application Controller</h4>

* In `controllers/applications.js` add:

  * Create a simple async function just to reponse the request

    ```JavaScript
        async function search(req, res) {
            try {
                //mongo query
                console.log(req.params[0]);
                //response
                res.json('ok');
            } catch (err) {
                console.log(err);
                res.json(err);
            }
        }

        module.exports = {
            search
        };
    ```

<h4 id='serverapis'>Add API Routes to the Server</h4>

* In `server.js`
  * Add the new routes (requests and users) before the catch all route

    ```JavaScript
        //! Put API routes here, before the "catch all" route
        app.use('/api/users', require('./routes/api/users'));
        app.use('/api/', require('./routes/api/requests'));

        //! API Routes -  Put them before the "catch all" route - The following "catch all" route (note the *)is necessary for a SPA's client-side routing to properly work
        app.get('/*', function(req, res) {
            res.sendFile(path.join(__dirname, 'build', 'index.html'));
        });
    ```

<h3 id='serverstructure1'>Server Structure</h3>

[Go Back to Summary](#summary)

```Bash
    .
    ├── config
    │   ├── auth.js
    │   └── database.js
    ├── controllers
    │   ├── applications.js
    │   └── users.js
    ├── models
    │   └── user.js
    ├── node_modules
    ├── public
    │   ├── favicon.ico
    │   ├── index.html
    │   └── robots.txt
    ├── routes
    │   ├── requests.js
    │   └── users.js
    ├── src
    │   ├── App.css
    │   ├── App.js
    │   ├── App.test.js
    │   ├── index.css
    │   ├── index.js
    │   ├── serviceWorker.js
    │   └── setupTests.js
    ├── .env
    ├── package-lock.json
    ├── package.json
    ├── Procfile
    └── server.js
```
