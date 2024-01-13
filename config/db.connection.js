import mongoose from "mongoose";

const dbConnection = async (db_URL)=>{
try {
    console.log("db_URL",db_URL);
    await mongoose.connect(db_URL);

} catch (error) {
    console.log("Error while connecting DB: ",error)
}
}

export default dbConnection;