import express from 'express'
import { UserModel } from './Models/User.js'
import Validator from 'validatorjs';
import bcrypt from 'bcrypt'
const app = express();

app.use(express.json())

const PORT = 4001;

app.get('/', async (req,res)=>{
    let data ={
        username:'testing',
        email:'test@mail.com',
        password:'test@123'
    }
    let rules ={
        username:'required|min:5|max:12',
        email:'required|email',
        password:'required|min:4|max:12'
    }
    let validation = new Validator(data, rules);

    var result;

    if(validation.passes()){
        var exists = await UserModel.findAll({
            where: {
              email: data.email
            }
          }
        );
        if(exists.length>0){
            //if user exists
            result = {status_code:0, status_text:'failed', message:'Exists'};
        } else{
            //hash before sending
            data.password = await bcrypt.hash(data.password, 10);
            result = await  UserModel.create(data);
        }
    }else{
        //validation errors
        result = validation.errors;
    }

    res.send({status_code:1, status_text:'success', message:'working',result:result});
})

app.get('/login', (res,req) => {
    let data ={
        email: 'testing@mail.com',
        password: ''
    }
})

app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`)
})