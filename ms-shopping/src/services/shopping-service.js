const { ShoppingRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-errors");

// All Business logic will be here
class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  async getCart({ _id }) {
    try {
      const cartItems = await this.repository.Cart(_id);
      return FormateData(cartItems);
    } catch (err) {
      throw err;
    }
  }

  async PlaceOrder(userInput) {
    const { _id, txnNumber } = userInput;

    // Verify the txn number with payment logs

    try {
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
      return FormateData(orderResult);
    } catch (err) {
      throw new APIError("Data Not found", err);
    }
  }

  async GetOrders(customerId) {

    const orders = await this.repository.Orders(customerId);
    return FormateData(orders)
  }

  async GetOrderDetails({ _id, orderId }) {
    const orders = await this.repository.Orders(productId);
    return FormateData(orders)
  }

  async ManageCart(customerId, item, qty, isRemove) {
    try {
      const orderResult = await this.repository.AddCartItem(customerId, item, qty, isRemove);
      return FormateData(orderResult);
    } catch (err) {
      throw err;
    }
  }

  async SubscribeEvents(payload) {

    payload = JSON.parse(payload);

    const { event, data } = payload;

    const { userId, product, qty } = data;

    switch (event) {
      case 'ADD_TO_CART':
        this.ManageCart(userId, product, qty, false);
        break;
      case 'REMOVE_FROM_CART':
        this.ManageCart(userId, product, qty, true);
        break;
      case 'TEST':
        console.log("WORKING ms-shopping ... suscriber");
        break;
      default:
        break;
    }

  }

  async GetOrderPayload(userId, order, event) {
    if (order) {
      const payload = {
        event,
        data: {
          userId,
          order
        }
      }
      return FormateData(payload);
    } else {
      return FormateData({ error: "No order is available" });
    }
  }
}

module.exports = ShoppingService;
