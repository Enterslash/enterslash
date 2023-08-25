import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { logger } from "../middleware/logger/logger";

export let ioRef: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export const createSocket = (server, listeners) => {
  ioRef = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET, POST"],
    },
  });
  const onConnection = (socket) => {
    listeners(ioRef, socket);
    socket.on("socket:subscribe", (payload) => {
      const { user } = payload;
      socket.join(user);
    });
    logger.info("New client connected");
  };
  ioRef.on("connection", onConnection);
};
