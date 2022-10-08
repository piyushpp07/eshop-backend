const { Category } = require('../models/category')
const express = require('express')
const router = express.Router()

//get all categories
router.get('/', async (req, res) => {
   const categoriesList = await Category.find();
   if (!categoriesList) {
      res.status(500).json({ success: true })
   }
   res.status(200).send(categoriesList)
})



//get a single category
router.get('/:id', async (req, res) => {
   const category = await Category.findById(req.params.id);
   if (!category)
      res.status(500).json({ message: "the category with given Id was not found" })
   res.status(200).send(category)
})


//create a new category
router.post('/', async (req, res) => {
   let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color
   });
   category = await category.save();
   if (!category)
      return res.status(404).send('the category can not be created');
   res.send(category);
})


//update a category
router.put('/:id', async (req, res) => {
   const category = await Category.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color
   }, { new: true })
   if (!category)
      return res.status(404).send('the category can not be created');
   res.send(category);
})

//api/v1/:id

//delete a category with id 
router.delete('/:id', (req, res) => {
   Category.findByIdAndRemove(req.params.id).then(category => {
      if (category)
         return res.status(200).json({ success: true, message: "category is deleted" })
      else {
         return res.status(404).json({ success: false, message: "category not found" })
      }

   }).catch((err) => {
      return res.status(400).json({ success: false });
   })
})

module.exports = router