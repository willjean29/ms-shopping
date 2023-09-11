const CustomerService = require("../services/customer-service");

module.exports = (app) => {
  const service = new CustomerService();

  app.use("/app-events", async (req, res) => {
    const { payload } = req.body;
    console.log("=========== Customers Service recived events ===========");
    service.SubscribeEvents(payload);

    return res.status(200).json(payload);
  })
}