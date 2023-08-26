import { DeleteAccountDTO } from "@enterslash/enterus/types";
import $api from "./client";

export const delete_account = (data: DeleteAccountDTO) : Promise<string> => {
    return  $api.post('/user/account/delete', data);
}