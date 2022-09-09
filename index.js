import express from 'express'
import { UserModel } from './Models/User.js'
import Validator from 'validatorjs';
import bcrypt from 'bcrypt'
const app = express();

app.use(express.json())

const PORT = 4001;

const saltRounds = 10;
//Routing
app.get('/', async (req,res)=>{
    //get data
    let data ={
        username:'tester',
        email:'tester@mail.com',
        password:'tester@123'
    }
    //validation first
    let rules ={
        username:'required|min:5|max:12',
        email:'required|email',
        password:'required|min:4|max:12'
    }
    let validation = new Validator(data, rules);

    var result;

    if(validation.passes()){
        var exists = await UserModel.findAll({ where: {email: data.email} });
        if(exists.length>0){
            //if user exists
            result = {status_code:0, status_text:'failed', message:'Exists'};
        } else{
            //hash before sending
            var salt = bcrypt.genSaltSync(saltRounds);
            data.password = await bcrypt.hashSync(data.password, salt);
            result = await  UserModel.create(data);
        }
    }else{
        //validation errors
        result = validation.errors;
    }

    res.send({status_code:1, status_text:'success', message:'working',result:result});
})

app.get('/login', async(req,res) => {

    let data ={
        email: 'tesit@mail.com',
        password: 'test@123'
    }

    let rules = {
        email: 'required|email',
        password: 'required'
    }

    let validation = new Validator(data,rules);
    // data.password = await bcrypt.compareSync(data.password, UserModel.password);
    var result;

    if(validation.passes()){
        let exist = await UserModel.findAll({
            where:{
                email: data.email,
            }
        }) 
        console.log(exist.users.defaultValue.password)
        
        if(exist.length>0){
            const validPassword = await bcrypt.compareSync(exist.password,data.password)
            if(validPassword){
                result = {message: 'auth'}
            }
        }else{
            result = {message: 'unauth'}
        }
    }else{
        result = validation.errors;
    }

    res.send({status_code:1, status_text:'success', message:'working', result: result});
})

app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`)
})