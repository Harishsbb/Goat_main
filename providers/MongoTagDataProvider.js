const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const util = require("util");
const { execFile } = require("child_process");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn; 
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1); 
  }
};

class MongoTagDataProvider {

    constructor(conn) {
        
        this.conn = conn;
        

        this.db = this.conn.connection.useDb("Goat_main");
        this.collection = this.db.collection("tag_data");
    }

    async getTagData(videoId) {
        try {
            const record = await this.collection.findOne({
                videoId: videoId
                
            });
            
            if (record) {
                console.log("Loaded from MongoDB");
                return record.data;
            }

            console.log("Data not found in MongoDB");
            throw new Error("file missing");
        } catch (e) {
            console.error("error when fetching tag data", e);
            throw e;
        }
    }
}

module.exports = {
    connectDB,MongoTagDataProvider
};

