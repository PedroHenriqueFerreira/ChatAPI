const roomModel = require('../models/roomModel');

module.exports.create = async (req, res) => {
    try {
        const room = new roomModel(req.body, req.userId);
        const roomResults = await room.create();
        if(room.errors.length > 0) {
            return res.status(400).json({ errors: room.errors });
        }

        return res.status(201).json(roomResults);

    } catch(err) {
        return res.status(400).json(err);
    }
}

module.exports.join = async (req, res) => {
    try {
        const room = new roomModel( req.body , req.userId);
        const roomResults = await room.join();
        if(room.errors.length > 0) {
            return res.status(400).json({ errors: room.errors });
        }

        return res.status(200).json(roomResults);

    } catch(err) {
        return res.status(400).json(err);
    }
}

module.exports.getAll = async (req, res) => {
    try {
        const room = new roomModel(req.body, { name: req.userName, id: req.userId});
        const roomResults = await room.getAll();
        if(room.errors.length > 0) {
            return res.status(400).json({ errors: room.errors });
        }

        return res.status(200).json(roomResults);

    } catch(err) {
        return res.status(400).json(err);
    }
}

module.exports.getOne = async (req, res) => {
    try {
        const room = new roomModel(req.params, req.userId);
        const roomResults = await room.getOne();
        if(room.errors.length > 0) {
            return res.status(401).json({ errors: room.errors });
        }

        return res.status(200).json(roomResults);

    } catch(err) {
        return res.status(400).json(err);
    }
}

module.exports.delete = async (req, res) => {
    try {
        const room = new roomModel(req.params, req.userId);
        const roomResults = await room.delete();
        if(room.errors.length > 0) {
            return res.status(400).json({ errors: room.errors });
        }

        return res.status(201).json(roomResults);

    } catch(err) {
        return res.status(400).json(err);
    }   
}

module.exports.message = async (req, res) => {
    try {
        const room = new roomModel(req.body, { id: req.userId, name: req.userName });
        const roomResults = await room.message();
        if(room.errors.length > 0) {
            return res.status(400).json({ errors: room.errors });
        }

        return res.status(200).json(roomResults);

    } catch(err) {
        return res.status(400).json(err);
    }   
}