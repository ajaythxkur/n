import express from 'express'
import { UserModel } from './Models/User.js'
import Validator from 'validatorjs';
import bcrypt from 'bcrypt'
const app = express();

app.use(express.json())

const PORT = 4001;

//Routing
app.get('/', async (req,res)=>{
    //get data
    let data ={
        username:'testing',
        email:'test@mail.com',
        password:'test@123'
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
            data.password = await bcrypt.hashSync(data.password, 10);
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
        email: 'test@mail.com',
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
        // console.log(exist)
        if(exist.length>0){
            const validPassword = await bcrypt.compareSync('$2b$10$SnzBTqU4vPIY/1FeRR3bPu4ndW3ykQAdaC7ibaFVcqlhC1J4pFDru',data.password)
            if(validPassword){
                result = {message: 'Password does not match'}
            }else{
                result = {message: 'Authorized'}
            }
        }else{
            result = {message: 'Unauthorized'}
        }
    }else{
        result = validation.errors;
    }

    res.send({status_code:1, status_text:'success', message:'working', result: result});
})

app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`)
})