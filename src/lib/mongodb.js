import mongoose from "mongoose";

global.mongoose = {
    conn: null,
    promise: null,
};

export async function dbConnect() {
    try {
        if (global.mongoose && global.mongoose.conn) {
            console.log("Connected previously established");
            return global.mongoose.conn;
        } else {
            const conString = process.env.MONGODB_URI;

            const promise = mongoose.connect(conString, {
                autoIndex: true,
            });

            global.mongoose = {
                conn: await promise,
                promise,
            };

            console.log("New connection established");
            return await promise;
        }
    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw new Error("Database connection failed");
    }
}