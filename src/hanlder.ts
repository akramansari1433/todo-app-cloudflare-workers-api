import { Router } from "itty-router";
import { PostgrestClient } from "@supabase/postgrest-js";

const router = Router();
const client = new PostgrestClient(
   "https://impacts-fallen-pipe-buy.trycloudflare.com"
);

const errorHandler = (error: { message: string; status: any }) => {
   const errMsg = JSON.stringify(error.message || "Server Error");
   return new Response(errMsg, { status: error.status || 500 });
};

router.get("/tasks", async () => {
   const { data } = await client.from("tasks").select();
   return new Response(JSON.stringify(data));
});

router.get("/tasks/:id", async ({ params }) => {
   const { id } = params;
   const { data } = await client.from("tasks").select().eq("id", id);
   const task = data?.length ? data[0] : null;
   return new Response(JSON.stringify(task));
});

router.post("/tasks", async (request) => {
   const date = new Date().toISOString().split("T")[0];
   let task = await request.json();
   task = { ...task, createdat: date };
   const { data, error } = await client.from("tasks").insert([task]).select();
   return new Response(JSON.stringify(data ? data : { error: error.message }));
});

router.post("/tasks/update/:id", async (request) => {
   const { id } = request.params;
   const task = await request.json();
   const { data, error } = await client
      .from("tasks")
      .update(task)
      .eq("id", id)
      .select();
   return new Response(JSON.stringify(data ? data : { error: error.message }));
});

router.delete("/tasks/:id", async ({ params }) => {
   const { id } = params;
   const { data } = await client.from("tasks").delete().eq("id", id);
   return new Response(JSON.stringify(data));
});

router.all("*", () => new Response("Not Found.", { status: 404 }));

export const handleRequest = async (request: Request) => {
   return router.handle(request).catch(errorHandler);
};
