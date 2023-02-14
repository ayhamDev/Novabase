const { default: mongoose } = require("mongoose");

module.exports = () => {
  console.log("Connecting To MongoDB...".blue);
  mongoose.set("strictQuery", false);
  return mongoose.connect(process.env.MONGODB).catch((err) => {
    console.log(err);
    process.exit(1);
  });
};
