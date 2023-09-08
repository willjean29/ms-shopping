module.exports = (app) => {
  app.use('/app-events', async (req, res) => {
    const { payload } = req.body;
    console.log("=========== Products Service recived events ===========");
    return res.status(200).json(payload);
  })
}