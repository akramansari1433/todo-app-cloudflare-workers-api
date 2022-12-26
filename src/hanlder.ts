import { Router } from "itty-router";
import { PostgrestClient } from "@supabase/postgrest-js";

const corsHeaders = {
   "Access-Control-Allow-Origin": "*",
   "Content-Type": "application/json",
   "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE",
   "Access-Control-Max-Age": "86400",
};

const router = Router();
const client = new PostgrestClient(
   "https://belong-wesley-iceland-answering.trycloudflare.com"
);

const errorHandler = (error: { message: string; status: any }) => {
   const errMsg = JSON.stringify(error.message || "Server Error");
   return new Response(errMsg, { status: error.status || 500 });
};

router.get("/tasks", async () => {
   const { data } = await client
      .from("tasks")
      .select()
      .order("createdat", { ascending: false });
   return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders },
   });
});

router.get("/tasks/:id", async ({ params }) => {
   const { id } = params;
   const { data } = await client.from("tasks").select().eq("id", id);
   const task = data?.length ? data[0] : null;
   return new Response(JSON.stringify(task), {
      headers: { ...corsHeaders },
   });
});

router.post("/tasks", async (request) => {
   const date = new Date().toISOString().split("T")[0];
   let task = await request.json();
   task = { ...task, createdat: date };
   const { data, error } = await client.from("tasks").insert([task]).select();
   return new Response(JSON.stringify(data ? data : { error: error.message }), {
      headers: { ...corsHeaders },
   });
});

router.post("/tasks/update/:id", async (request) => {
   const { id } = request.params;
   const task = await request.json();
   const { data, error } = await client
      .from("tasks")
      .update(task)
      .eq("id", id)
      .select();
   return new Response(JSON.stringify(data ? data : { error }), {
      headers: { ...corsHeaders },
   });
});

router.delete("/tasks/:id", async ({ params }) => {
   const { id } = params;
   const { data } = await client.from("tasks").delete().eq("id", id);
   return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders },
   });
});

router.all("*", () => new Response("Not Found.", { status: 404 }));

export const handleRequest = async (request: Request) => {
   return router.handle(request).catch(errorHandler);
};
