require('dotenv').config();
const express = require('express');
var cors = require('cors')
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

const corsOptions = {
    origin: '*',
    methods: ['POST','GET','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
// app.use((req,res,next)=>{
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Acces-Control-Allow-Methods", "POST,GET,OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
//     if(req.method === 'OPTIONS'){
//         return res.sendStatus(200);
//     }
//     next();
// })

app.use(isAuth);

app.use('/graphql', graphqlHttp({
    schema:graphqlSchema,
    rootValue:graphqlResolvers,
    graphiql: true
}));

 
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true }).then(()=>console.log('connected to databse')).catch(err=>console.log('wrong url'));
app.listen(4000);