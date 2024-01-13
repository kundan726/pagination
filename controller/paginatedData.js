import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URL;
console.log("uri", uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// NOTE : Here we are learning pagination in a single document in a collection(When there is only one document present in the collection)

// This approach is suitable for small numbers of documents in collection but not when there is large no of documets
const getPaginatedData = async (req, res) => {
  try {
    await client.connect();
    const database = client.db("aggregation");
    const collection = database.collection("pagination");
    // Query the collection
    const result = await collection.find({}).toArray();
    const itemPerPage = 3;
    const pageNo = parseInt(req.query.page) || 1;
    console.log("pageNo", result);
    const startIndex = (pageNo - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    const filteredData = result[0].data.articles.slice(startIndex, endIndex);

    res.send({
      result: filteredData,
      pageNo: pageNo,
      itemPerPage: itemPerPage,
      startIndex: startIndex,
      endIndex: endIndex,
    });
  } catch (error) {
    console.log("Error while fetching Data from DB: ", error);
  }
};

// const getPaginatedDataDirectlyFromDB = async (req, res) => {
//   try {
//     await client.connect();
//     const database = client.db("aggregation");
//     const collection = database.collection("pagination");
//     // Query the collection
//     const itemPerPage = 3;
//     const pageNo = parseInt(req.query.page) || 1;
//     const startIndex = (pageNo - 1) * itemPerPage;
//     console.log("pageNo:", pageNo);
// console.log("startIndex:", startIndex);
// console.log("itemPerPage:", itemPerPage);

//     let result = await collection.find({}).skip(startIndex).limit(itemPerPage).toArray();

//     res.send({
//       result: result,
//       pageNo: pageNo,
//       itemPerPage: itemPerPage,
//       startIndex: startIndex,
//     });
//   } catch (error) {
//     console.log("Error while fetching Data from DB: ",error);
//   }
// };

// Below approach is suitable  when there is large no of documents in collection

const getPaginatedDataDirectlyFromDB = async (req, res) => {
  try {
    await client.connect();
    const database = client.db("aggregation");
    const collection = database.collection("pagination");

    // Query the collection to get the single document
    const singleDocument = await collection.findOne({});
    if (
      !singleDocument ||
      !singleDocument.data ||
      !singleDocument.data.articles
    ) {
      return res.status(404).send({ error: "No data found in the collection" });
    }

    // Extract articles array from the single document
    const articles = singleDocument.data.articles;

    const itemPerPage = 3;
    const pageNo = parseInt(req.query.page) || 1;
    const startIndex = (pageNo - 1) * itemPerPage;

    // Calculate the total number of pages
    const totalPages = Math.ceil(articles.length / itemPerPage);

    // Ensure the requested page is within valid range
    if (pageNo > totalPages) {
      return res.status(400).send({ error: "Invalid page number" });
    }

    console.log("pageNo:", pageNo);
    console.log("startIndex:", startIndex);
    console.log("itemPerPage:", itemPerPage);

    // Slice the articles array to get the paginated result
    const result = articles.slice(startIndex, startIndex + itemPerPage);

    res.send({
      result: result,
      pageNo: pageNo,
      itemPerPage: itemPerPage,
      startIndex: startIndex,
      totalPages: totalPages,
    });
  } catch (error) {
    console.log("Error while fetching Data from DB: ", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

export { getPaginatedData, getPaginatedDataDirectlyFromDB };
