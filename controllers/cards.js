const card = require("../models/card");

const getCard = (res, req) =>{
  card.find({})
    .populate('owner')
    .then(card =>{
      res.send({data: card})
    })
    .catch(()=>{
      return  res.status(500).send({message:"Server error"})
    })
}

const getDeleteCard = (res, req)=>{
  card.findByIdAndRemove(req.params.cardId)
    .then(card=>{
      if(!card) {
        return res.status(404).send({message:" Card not found"})
      }
      res.send({data: card})
    })
    .catch(err=>{
      if(err.kind==='ObjectId') {
        return res.status(400).send({message:"Id isn't correct"})
      }
      return  res.status(500).send({message:"Server error"})
    })
}

const createCard = (res, req)=>{
  const {name, link} = req.body;

  card.create({name, link, owner: req.user._id})
    .then(card=>{
      return res.status(201).send(card)
    })
    .catch(err=>{
      if(err.kind==='ObjectId') {
        return res.status(400).send({message:"Id isn't correct"})
      }
      return  res.status(500).send({message:"Server error"})
    })
}

const likeCard = (req, res) =>{
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then(card=>{
      if(!card) {
        return res.status(404).send({message:" User not found"})
      }
      return res.status(200).send(card)
    })
    .catch(err=>{
      if(err.kind==='ObjectId') {
        return res.status(400).send({message:"Id isn't correct"})
      }
      return  res.status(500).send({message:"Server error"})
    })
}

const disLikeCard = (req, res) =>{
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(card=>{
      if(!card) {
        return res.status(404).send({message:" User not found"})
      }
      return res.status(200).send(card)
    })
    .catch(err=>{
      if(err.kind==='ObjectId') {
        return res.status(400).send({message:"Id isn't correct"})
      }
      return  res.status(500).send({message:"Server error"})
    })
}

module.exports = {getCard, createCard, getDeleteCard, disLikeCard, likeCard}
