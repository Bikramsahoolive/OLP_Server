let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser,getUser,findOne,updatePass} = require("../model/users");

exports.login = async(req,res)=>{
    try{
        const {useremail,usertype,password } = req.body;
        // console.log(usertype)   
        const user = await findOne(useremail);
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });
    // if(user.usertype != usertype){
    //     return res.status(400).json({message:"Wrong Usertype"})
    // }
    delete user.password;
    let token = jwt.sign(user,process.env.SECRETE_KEY); 
        // console.log(token);
        
    res.cookie('token',token,{ httpOnly:true, secure:true,sameSite: 'None'})

    res.status(200).json({ message: "Login successful", user});

    }catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.createUser = async(req,res)=>{
    try {
        // const { username, usertype, useremail,password } = req.body;
        const userData = req.body;

        // const userData = {
        //     username,
        //     usertype,
        //     useremail,
        //     password
        //   };
        const data = await createUser(userData);
        res.status(201).json({ status:'success',message: 'User created successfully'});
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
}

exports.updatePassword = async(req,res)=>{
    try{
        // console.log('request body ',req.body)
        const saltRounds = 10;
        const hashed = await bcrypt.hash(req.body.newpassword, saltRounds);
        let data ={
            hashedPassword:hashed,
            id:req.params.id
        }
        // console.log(data)
        const updatemsg = await updatePass(data)
       res.status(200).send(updatemsg)
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

exports.logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });

    res.status(200).json({ message: "Logout successful" });
};

exports.findOneUser = async(req,res)=>{
    console.log(req.body.useremail)
    const user = await findOne(req.body.useremail)
    console.log(user)
    if (!user) res.status(400).json({ message: "User not found" });
    else{
         res.status(200).json({user:user})
    }
}

exports.getUsers = async(req,res)=>{
    try{
        const data = await getUser();
        res.status(200).json(data)
    }catch(err){
        res.status(500).json({error:err.message})
    }
}