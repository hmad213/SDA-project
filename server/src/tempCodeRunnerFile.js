app.get("/", (req, res) => {
  res.send("Hello world");
  res.updateCustomer(1, "city = sahiwaal");
});
