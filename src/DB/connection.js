import chalk from "chalk";
import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect(process.env.CONNECTION_URL).then(() => console.log(chalk.blue.bgBlue("Connected to MongoDB")))
    .catch((err) => console.log(err));
};

export default connectDB