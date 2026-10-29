
import "dotenv/config";

import {
  MongoClient,
  ServerApiVersion,
} from "mongodb";

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db(
  process.env.DB_NAME || "vayro"
);

const connectDB = async () => {
  await client.connect();

  await client.db("admin").command({
    ping: 1,
  });

  console.log("MongoDB Connected Successfully!");
};

export { client, db, connectDB };
