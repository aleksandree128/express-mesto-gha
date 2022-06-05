const user = require("../models/user");

const getUser = (req, res)=>{
  const id = req.params.id
  user.findById(id)
    .then(user=>{
      if(!user) {
        return res.status(404).send({message:" User not found"})
      }
      return res.status(200).send(user)
    })
    .catch(err=>{
      if(err.kind==='ObjectId') {
        return res.status(400).send({message:"Id isn't correct"})
      }
      return  res.status(500).send({message:"Server error"})
    })
}

const createUser = (req, res)=>{
  const {name, age} = req.body

  if(!age || !name) {
    return res.status(404).send({message:"Age or Name no validated"})
  }
  user.create({name, age})
    .then(user=>{
      return res.status(201).send(user)

    })
    .catch(err=>{
      if(err.name==='ValidationError') {
        const fields = Object.keys(err.errors).join(', ')
        return res.status(400).send({message:`${fields} are not correct`})
      }
      if(err.code===11000) {
        return res.status(409).send({message: "Such use is already in database"})
      }
      return  res.status(500).send({message:"Server error"})
    })
}

const getUsers = (_, res)=>{
  user.find({})
    .then(users=>{
      res.status(200).send(users)
    })
    .catch(err=>{
      res.status(500).send({message:"Server error"})
    })

}

const getUpdateUserInfo = (req, res)=>{
  const {name, about} = req.body
  user.findByIdAndUpdate(req.user._id, {name, about}, {
    new: true,
    runValidators: true,
    upsert: false
  })
    .then( user=>{
      if(!user) {
        return res.status(404).send({message:" User not found"})
      }
    })
    .catch(err=>{
      if(err.name==='ValidationError') {
        const fields = Object.keys(err.errors).join(', ')
        return res.status(400).send({message:`date not correct`})
      }
      return  res.status(500).send({message:"Server error"})
    })
}

const getUpdateUserAvatar = (req, res) =>{
  const avatar = req.body
  user.findByIdAndUpdate(req.user._id, avatar, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then( user=>{
      if(!user) {
        return res.status(404).send({message:'User not found'})
      }
    })
    .catch(err=>{
      if(err.name==='ValidationError') {
        const fields = Object.keys(err.errors).join(', ')
        return res.status(400).send({message:'date not correct'})
      }
      return  res.status(500).send({message:'Server error'})
    })
}

module.exports = {getUser, createUser, getUsers, getUpdateUserInfo, getUpdateUserAvatar}

