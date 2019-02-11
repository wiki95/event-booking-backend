const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
    createUser: async args =>{
        try{
            const existingUser = await User.findOne({email:args.userInput.email})
            if(existingUser){
                throw new Error('User already exist')
            }
            const hashedPass = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPass
            });
            const result = await user.save();
            return {...result._doc,password:null, _id: result._doc._id.toString()}
        }
        catch(err){
            throw err;
        }},
    login: async ({email, password})=>{
        const user = await User.findOne({email:email});
        if(!user){
            throw new Error('user does not exist');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            throw new Error('password is incorrect');
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.TOKEN_KEY, {
            expiresIn: '1h'
        });
        return { userId: user.id, token: token, tokenExpiration: 1 }
    }
};