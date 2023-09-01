import { IRoomIdentifiers } from "@enterslash/enterus/types";
import $api from "./client";

export const get_room_identifiers = (): Promise<IRoomIdentifiers> => {
    return $api.get('/room/identifiers');
}