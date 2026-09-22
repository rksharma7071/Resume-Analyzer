import mongoose from "mongoose";

async function connectToDB() {
  try {
    console.log("MONGODB_URI: ",process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to Database");
  } catch (error) {
    console.log("Database Connection Error:", error);
  }
}

export default connectToDB;