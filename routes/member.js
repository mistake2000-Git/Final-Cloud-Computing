const express = require('express')
const router = express.Router();
const mydb = require('../index')

//Create new member
router.post('/createMember',async(req,res)=>{
    const {_id,name,position} = req.body
    try
    {   
        console.log(req.body)
        await mydb.insert({_id,name,position})
        res.json({success:true,message:"Create member successfully"})
    }
    catch(err)
    {
        console.log(err.message)
        res.json({success:false,message:"Duplicate member ID!!"})
    }
})

//Get all member
router.get('/getall',async(req,res)=>{
    try
    {
        const Members = await mydb.list({include_docs: true})
        const memberList= []
        Members.rows.forEach((rows) => {
            memberList.push(rows.doc)
          })
        res.json(memberList)
    }
    catch(err)
    {
        console.log(err.message)
        res.json({success:false,message:"Intenal Error!"})
    }
})
//Delete Member
router.delete('/delete/:id',async(req,res)=>{
    const id = req.params.id
    console.log(id)
    try
    {
        const member = await mydb.get(id)
        console.log(member)
        await mydb.destroy(member._id,member._rev)
        res.json({success:true,message:"Delete successfully!"})
    }
    catch(err)
    {
        console.log(err.message)
        res.json({success:false,message:"Can not find the member to delete"})
    }
})

router.put('/update',async(req,res)=>{
    const {_id,name,position}= req.body
    try{
        const member = await mydb.get(_id)
        await mydb.insert({_id:member._id,_rev:member._rev,name,position})
        res.json({success:true,message:"Update successfully!"})
    }
    catch(err)
    {
        console.log(err.message)
        res.json({success:false,message:err.message})
    }
})
module.exports= router