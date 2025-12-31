import { prismaManager } from "../../prisma/prisma.js";

prismaManager.$connect().then(() => {
  console.log("Connected to the database.");
}).catch((error) => {
  console.error("Error connecting to the database:", error);
});
