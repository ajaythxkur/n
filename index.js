import express from 'express'

const app = express();

app.use(express.json())

const PORT = 4001;

app.get('/', (req,res)=>{
    return res.json('working');
})






app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`)
})