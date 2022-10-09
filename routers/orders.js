const { Order } = require('../models/order')
const { OrderItem } = require('../models/order-item')
const express = require('express')
const { response } = require('express')
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
   let totalPrices = await Promise.all(orderItemIdsResolved.map(async orderItemId => {
      const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
      const totalPrice = orderItem.product.price * orderItem.quantity
      return totalPrice
   }))
   const totalPrice = totalPrices.reduce((a, b) => a + b, 0)
   console.log(totalPrices)
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
      totalPrice: totalPrice,
      user: req.body.user
   });
   order = await order.save();
   if (!order)
      return res.status(404).send('the order can not be created');
   res.send(order);
})

router.put('/:id', async (req, res) => {
   const order = await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status
   }, { new: true })
   if (!order)
      return res.status(404).send('the order can not be created');
   res.send(order);
})

//delete a Order with id 
router.delete('/:id', (req, res) => {
   Order.findByIdAndRemove(req.params.id).then(async order => {
      if (order) {
         await order.orderItems.map(async orderItem => {
            await orderItem.findByIdAndRemove(orderItem)
         })
         return res.status(200).json({ success: true, message: "order is deleted" })

      }

      else {
         return res.status(404).json({ success: false, message: "order not found" })
      }

   }).catch((err) => {
      return res.status(400).json({ success: false });
   })
})

router.get('/get/totalsales', async (req, res) => {
   const totalSales = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
   ])
   if (!totalSales) {
      return res.status(400).send('The order sales can not be generated')
   }
   return res.send({ totalsales: totalSales.pop().totalSales })
})


router.get(`/get/count`, async (req, res) => {
   const orderCount = await Order.countDocuments()
   if (!orderCount)
      res.status(500).json({ success: false })
   res.send({
      orderCount: orderCount
   })
})

module.exports = router;