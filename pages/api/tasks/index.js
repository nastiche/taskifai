import dbConnect from "../../../db/connect";
import Task from "../../../db/models/Task";

export default async function handler(request, response) {
  await dbConnect();

  if (request.method === "POST") {
    try {
      const taskData = request.body;
      await Task.create(taskData);
      response.status(201).json({ status: "Task created" });
    } catch (error) {
      console.log(error);
      response.status(400).json({ error: error.message });
    }
  }
}
