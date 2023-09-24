// In your controller (orderController.js)
const orderHelper = require('../helpers/orderHelper');

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const updatedOrder = await orderHelper.cancelOrder(orderId);

    // Check if the order was successfully cancelled
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Send a response to indicate success
    res.json({ message: 'Order cancelled successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  cancelOrder,
};
