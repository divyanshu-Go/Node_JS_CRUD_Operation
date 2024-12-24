const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Person = require('./../MODEL/person')
const passport = require('passport')
const {jwtAuthMiddleware, generateToken}=require('./../AUTHEN/jwt')

localAuthMiddleware = passport.authenticate('local', { session: false });

router.get('/',jwtAuthMiddleware, function (req, res) {
    res.send('Hello world')
})
router.get('/person',jwtAuthMiddleware,  async (req, res) => {
    try {
        const data = await Person.find()
        res.status(200).json(data)

    } catch (err) {
        res.status(501).json(err)
    }
})
router.get('/person/profile', jwtAuthMiddleware, async (req, res)=>{
   try {
     const userData= req.user;
     console.log('Userdata', userData)
 
     const user= await Person.findById(userData.id)
     res.status(200).json({user})
   } catch (error) {
     console.log(error)
     res.status(500).json({err: 'internal err'})
   }
})
router.get('/person/:ages', async (req, res) => {
    try {

        const response = await Person.find({ age: req.params.ages })
        console.log("data fetched.")

        res.status(200).json(response)
    } catch (err) {
        res.status(404).json(err)

    }
})
router.post('/person/signup', async (req, res) => {

    try {
        const person = new Person(req.body);
        const response = await person.save();
        
        console.log('Data Saved')
        const payload= {
            id: response.id,
            username: response.username
        }
       
        const token=generateToken(payload);
        
        res.status(200).json({response:response, token: token})
    } catch (err) {
        res.status(501).json(err)
    }

})
router.post('/person/login', async(req, res) => {
    try {
        const{username, password}= req.body;
        const user=await Person.findOne({username:username})
    
        if (!user || !await bcrypt.compare(password , user.password)) {
            return res.status(401).json({error: 'Invalid username or password'});
        }
    
        const payload= {
            id : user.id,
            username: user.username
        }
        const token= generateToken(payload);
        
        res.json({token:token})
    } catch (error) {
        console.error(error)
        res.status(500).json({err: 'server error'})
    }
})
router.put('/person/:id', async (req, res) => {
    try {

        const response = await Person.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        if (!response) {
            return res.send(404).json({ err: 'data not found' })
        }
        res.status(200).json(response)
        console.log('Data Updated')
    } catch (err) {
        res.status(501).json(err)
    }

})
router.delete('/person/:id', async (req, res) => {
    try {
        const response = await Person.findByIdAndDelete(req.params.id)
        if (!response) {
            return res.status(404).json({ error: 'Person not found' })
        }
        console.log('Data Deleted')
        res.status(200).json({ msg: 'deleted successfully' })
    } catch (err) {
        res.status(501).json(err)
    }
})



module.exports = router;