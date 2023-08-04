const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');
const router=express.Router();

//Access user info in YAML file
const userDataPath = 'ledger_DR.yaml';
const userData = fs.readFileSync(userDataPath, 'utf8');
const usersData = yaml.load(userData);
const usersInfoData=usersData['UserInfo'];

router.get('/allMembers', async(req,res)=>{
    let result;
    try{
        let countMembers=usersInfoData.length;
        result = {"success":JSON.parse(countMembers)};
    } catch(error){
        result = {"error":error.toString()};
    }
    res.json(result);
});

module.exports=router;