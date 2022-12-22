import { handleRequest } from "./hanlder";

addEventListener("fetch", (event) =>
   event.respondWith(handleRequest(event.request))
);
