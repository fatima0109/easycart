// Get all orders (admin only)
router.get('/', protect, admin, async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .populate('orderItems.product');
  res.json(orders);
});

// Update order status (admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.orderStatus = req.body.status;
    await order.save();
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});