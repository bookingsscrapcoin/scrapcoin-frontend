import { a9 as createStart, aa as createMiddleware } from "./vendor-Cr71NyXt.js";
import { r as renderErrorPage } from "./worker-entry-DOfc6-Iw.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }
});
const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware]
}));
export {
  startInstance
};
