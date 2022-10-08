const { Order } = require('../models/order')
const { OrderItem } = require('../models/order-item')
const express = require('express')
const router = express.Router()

router.get(`/`, async (req, res) => {
   //sorting descending 
   const orderList = await Order.find().populate('user', 'name').sort({ 'dateOrdered': -1 });
   if (!orderList) {
      res.status(500).json({ success: false })
   }
   res.send(orderList);
})


router.get(`/:id`, async (req, res) => {
   //sorting descending 
   const order = await Order.findById(req.params.id).populate('user', 'name').populate({
      path: 'orderItems',
      populate: {
         path: 'product',
         populate: 'category'
      }
   });
   if (!order) {
      res.status(500).json({ success: false })
   }
   res.send(order);
})


router.post('/', async (req, res) => {
   const orderItemIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
         quantity: orderItem.quantity,
         product: orderItem.product
      })
      newOrderItem = await newOrderItem.save()
      return newOrderItem._id
   }))

   const orderItemIdsResolved = await orderItemIds;
   console.log(orderItemIdsResolved)
   let order = new Order({
      orderItems: orderItemIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.zip,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: req.body.totalPrice,
      user: req.body.user
   });
   order = await order.save();
   if (!order)
      return res.status(404).send('the order can not be created');
   res.send(order);
})


module.exports = router;