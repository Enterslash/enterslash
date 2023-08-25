import { GetAppStateDTO, UpdateFcmTokenDTO } from "@enterslash/enterus/types";
import $api from "./client";

export const update_fcm = (data: UpdateFcmTokenDTO): Promise<string> => {
    return $api.put('/settings/fcm', data);
}

export const get_app_state = (): Promise<GetAppStateDTO> => {
    return $api.get('/app/state');
}