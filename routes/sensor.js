const express = require('express')
const router = express.Router();
const sensor = require('../model/sensorValue')
var value
router.post('/', async(req,res)=>{
    value = req.body
    console.log(value)
    const {deviceID,device_Name} = req.body
    try{
        const date = new Date().toLocaleDateString()
        let Sensor = new sensor({deviceID,device_Name,Sensor:"Light",Value:req.body.Light,Time:date})
        await Sensor.save()
        Sensor = new sensor({deviceID,device_Name,Sensor:"Humidity",Value:req.body.Humidity,Time:date})
        await Sensor.save()
        Sensor = new sensor({deviceID,device_Name,Sensor:"Temperature",Value:req.body.Temperature,Time:date})
        await Sensor.save()
        res.status(200).json({success:true})
    }catch(err){
        console.log(err)
        res.status(400).json({sucess:false})
    }

})


router.get('/getOne',async(req,res)=>{
    res.json(value)
})

router.get('/getAll',async(req,res)=>{
    try
    {
        const logs = await sensor.find();
        res.status(200).json(logs)
    }
    catch(err)
    {
        res.status(400).json({success:false})
    }
})

module.exports= router