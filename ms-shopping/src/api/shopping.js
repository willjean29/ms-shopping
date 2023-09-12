const ShoppingService = require("../services/shopping-service");
const { PublishCustomerEvent, PublishMessage, SuscribeMessage } = require("../utils");
const UserAuth = require('./middlewares/auth');

module.exports = (app, { kafka, producer }) => {

    const service = new ShoppingService();

    SuscribeMessage(kafka, [
        'MS_SHOPPING_ADD_TO_CART',
        'MS_SHOPPING_REMOVE_FROM_CART'
    ], service);

    app.post('/order', UserAuth, async (req, res, next) => {

        const { _id } = req.user;
        const { txnNumber } = req.body;


        try {
            const { data } = await service.PlaceOrder({ _id, txnNumber });
            const payload = await service.GetOrderPayload(_id, data, 'CREATE_ORDER');
            // PublishCustomerEvent(payload);
            PublishMessage(producer, 'MS_CUSTOMER_CREATE_ORDER', payload.data);
            return res.status(200).json(data);

        } catch (err) {
            next(err)
        }

    });

    app.get('/orders', UserAuth, async (req, res, next) => {

        const { _id } = req.user;

        try {
            const { data } = await service.GetOrders(_id);
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }

    });


    app.get('/cart', UserAuth, async (req, res, next) => {

        const { _id } = req.user;
        try {
            const { data } = await service.getCart({ _id });
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    });
}