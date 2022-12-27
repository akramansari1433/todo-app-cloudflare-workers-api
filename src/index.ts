import { Router } from "itty-router";
export interface Env {
   DB: D1Database;
}

export default {
   async fetch(request: Request, env: Env) {
      const router = Router();

      const { DB } = env;
      router.get("/tasks", async () => {
         const { results } = await DB.prepare("SELECT * FROM todos").all();

         return Response.json(results);
      });

      router.post("/tasks", async (request) => {
         let task = await request.json();
         const { success } = await DB.prepare(
            `insert into todos(id, task) values(?,?)`
         )
            .bind(task.id, task.task)
            .run();
         if (success) {
            return Response.json({ message: "Created" });
         } else {
            return Response.json({ error: "Something went wrong" });
         }
      });

      router.post("/tasks/update/:id", async (request) => {
         const { id } = request.params;
         const { success } = await DB.prepare(
            `update todos SET completed = 1 where id = ?`
         )
            .bind(id)
            .run();
         if (success) {
            return Response.json({ message: "Marked Completed" });
         } else {
            return Response.json({ error: "Something went wrong" });
         }
      });

      router.get("/tasks/delete/:id", async ({ params }) => {
         const { id } = params;
         const { success } = await DB.prepare("delete from todos where id = ?")
            .bind(id)
            .run();
         if (success) {
            return Response.json({ message: "Deleted" });
         } else {
            return Response.json({ error: "Something went wrong" });
         }
      });

      router.all("*", () => new Response("Not Found.", { status: 404 }));

      return router.handle(request, env);
   },
};
