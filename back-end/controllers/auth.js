const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');


const signUp = async (req,res,next) => {
    const {email} = req.body;
    try{
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User already exists' });
        }
        const user = await User.create({ ...req.body });

        const token = user.createJWT();

        res.status(StatusCodes.CREATED).json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    }catch(error){
        next(error);
    }
}

const login = async (req,res,next) => {
    try {    
        const {email,password} = req.body;

        if(!email || !password){
            res.status(StatusCodes.BAD_REQUEST).json({msg:'Please provide all values'});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(StatusCodes.BAD_REQUEST).json({msg:'The entered credentials are invalid or you must sign up'})
        }
        const passwordCompare = await user.passwordCompare(password);
        
        if(!passwordCompare){
            return res.status(StatusCodes.BAD_REQUEST).json({msg:'Invalid Credentials'})
        }
        const token = user.createJWT();
        
        res.status(StatusCodes.OK).json({token,user,msg:"Login Successful"});
    }catch(error){
        next(error);
    }
}







module.exports = {
    signUp,
    login,
}