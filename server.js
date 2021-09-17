const express = require ('express')
const bodyParser = require ('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const _ = require('underscore');
const app = express();

const register = require('./Controllers/register');
const signIn = require('./Controllers/signin');
const matchLoad = require('./Controllers/matchload');
const profile = require('./Controllers/profile');
const standings = require('./Controllers/standings')

const db = knex({
   client: 'pg',
   connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'databasepw',
      database: 'fifa'
   }
})

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send('this is working') });
app.get('/standings', (req, res) => { standings.handleStandingsGet(req, res, db)});
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
app.post('/signin', (req, res) => { signIn.handleSignin(req, res, db, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.post('/matchload', (req, res) => { matchLoad.handleMatchLoad(req, res, db )});

app.listen(3001, () => {
   console.log('It is alive!')
});


/*

/profile/:userId --> GET = user

*/