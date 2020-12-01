const userModel = require('../models/userModel');

module.exports.token = async (req, res) => {
    try {
        const user = new userModel(req.body);
        const userResults = await user.token();
        if(user.errors.length > 0) {
            return res.status(400).json({ errors: user.errors });
        }
    
        return res.json(userResults);

    } catch(err) {
        return res.json(err);
    }
}

module.exports.register = async (req, res) => {
    try {
        const user = new userModel(req.body);
        await user.register();
        if(user.errors.length > 0) {
            return res.status(400).json({ errors: user.errors });
        }
    
        return res.status(201).json({ success: true });

    } catch(err) {
        return res.json(err);
    }
}