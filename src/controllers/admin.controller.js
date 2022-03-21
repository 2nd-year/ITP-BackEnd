const bcryptjs = require("bcryptjs");
const Admin = require("../model/SystemAdminModel");
const { registerValidation} = require("../validations/adminValidation");

const addAdmin = async (req,res) => {

    //validate the user input feilds
    const {error} = registerValidation(req.body);
    if(error) {
        res.send({message:error['details'][0]['message']});
    }

    //to check user already exist
    const userExist = await Admin.findOne({email:req.body.email});
    if(userExist) {
        return res.status(400).send({message: "User alredy exist"})
    }

    //hash the password
    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(req.body.password, salt);

    const admin = new Admin({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        NIC: req.body.NIC,
        username: req.body.username,
        password: hashPassword,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        address: req.body.address,
    });

    try {
        const savedAdmin = admin.save();
        res.send(savedAdmin);
    }
    catch(error) {
        res.status(400).send({message:error});
    }
    };
    
//Get all admins function
const getAdmins = async (req,res) => {
        try{
        const admins = await Admin.find();
        res.send(admins);
    }
    catch(error){
        res.status(400).send({message: error});
    }
    }

//Update admin details
const updateAdmin = async (req,res) => {

    const adminId = req.params.id;

    try {
        const admin = await Admin.findById(adminId);
        if(!admin) {
            res.status(404).json("No User Found");
        }

        const {firstName, lastName, NIC, username, password, phoneNumber, email, address} = req.body;
        const updatedAdmin = await Admin.findByIdAndUpdate(adminId, {firstName, lastName, NIC, username, password, phoneNumber, email, address});

        res.status(200).json(updatedAdmin);
    }
    catch(err) {
        res.status(400).send({message: err});
    }
    };

//Delete admin account
const deleteAdmin = async (req,res) => {
    const adminId = req.params.id;

    try {
        const admin = await Admin.findById(adminId);

        if(!admin) {
            res.status(404).json("User Not Found");
        }

        const deletedAdmin = await Admin.findByIdAndDelete(adminId);
        res.status(200).json("Admin account Deleted");
    }
    catch(err) {
        res.status(400).json(err.message);
    }
    };

module.exports = {addAdmin, getAdmins, updateAdmin, deleteAdmin};