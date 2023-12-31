const ProductService = require("../services/product-service");
module.exports = (app) => {
  const service = new ProductService();

  app.use("/app-events", async (req, res) => {
    const { payload } = req.body;
    console.log("=========== Products Service recived events ===========");
    service.SubscribeEvents(payload);
    return res.status(200).json(payload);
  })
}