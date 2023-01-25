import { Router } from "itty-router";
export interface Env {
    DB: D1Database;
}

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST,DELETE",
    "Access-Control-Max-Age": "86400",
};
export default {
    async fetch(request: Request, env: Env) {
        const router = Router();

        const { DB } = env;
        router.get("/tasks", async () => {
            const { results } = await DB.prepare("SELECT * FROM todos").all();
            return Response.json(results, { headers: { ...corsHeaders } });
        });

        router.post("/tasks", async (request) => {
            let task = await request.json();
            const { success } = await DB.prepare(
                `insert into todos(id, task) values(?,?)`
            )
                .bind(task.id, task.task)
                .run();
            if (success) {
                return Response.json(
                    { message: " Task created successfully" },
                    { headers: { ...corsHeaders } }
                );
            } else {
                return Response.json(
                    { error: "Something went wrong" },
                    { headers: { ...corsHeaders } }
                );
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
                return Response.json(
                    { message: "Task marked completed" },
                    { headers: { ...corsHeaders } }
                );
            } else {
                return Response.json(
                    { error: "Something went wrong" },
                    { headers: { ...corsHeaders } }
                );
            }
        });

        router.get("/tasks/delete/:id", async ({ params }) => {
            const { id } = params;
            const { success } = await DB.prepare(
                "delete from todos where id = ?"
            )
                .bind(id)
                .run();
            if (success) {
                return Response.json(
                    { message: "Task deleted" },
                    { headers: { ...corsHeaders } }
                );
            } else {
                return Response.json(
                    { error: "Something went wrong" },
                    { headers: { ...corsHeaders } }
                );
            }
        });

        router.all(
            "*",
            () =>
                new Response("Not Found.", {
                    status: 404,
                    headers: { ...corsHeaders },
                })
        );

        return router.handle(request, env);
    },
};
