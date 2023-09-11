const ShoppingService = require("../services/shopping-service");

module.exports = (app) => {
  const service = new ShoppingService();

  app.use("/app-events", async (req, res) => {
    const { payload } = req.body;
    console.log("=========== Shopping Service recived events ===========");
    service.SubscribeEvents(payload);
    return res.status(200).json(payload);
  })
}