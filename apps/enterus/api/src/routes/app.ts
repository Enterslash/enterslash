import router from "express"
import { userAuthorization } from "../middleware/authorization";
import { pushNotification } from "../utils/push-notification";
import { getAppState, updateFcmToken } from "../controllers/app";

const appRouter = router.Router();

appRouter.get("/app/state", userAuthorization, getAppState);
appRouter.put("/settings/fcm", userAuthorization, updateFcmToken);

// appRouter.post("/settings/notification/test", async (req, res) => {
//     try {
//         const { token, title, message, link } = req.body;

//         await pushNotification({
//             body: message || "Test notification",
//             title: title || "Test notification",
//             // tokens: [token],
//             link,
//         })
//         res.status(200).json({ message: "Notification sent" });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// });

export default appRouter;
