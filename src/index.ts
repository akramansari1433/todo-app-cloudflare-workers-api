import { handleRequest } from "./hanlder";

addEventListener("fetch", (event) => {
   const { request } = event;
   return event.respondWith(handleRequest(request));
});
