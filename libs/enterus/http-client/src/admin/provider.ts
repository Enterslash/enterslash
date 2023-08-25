import { AssignServiceDTO, IUserModel } from "@enterslash/enterus/types";
import $api from "../client";

export const get_providers = (): Promise<IUserModel[]> => {
    return $api.get('/admin/providers');
}

export const assign_service = (data: AssignServiceDTO): Promise<string> => {
    return $api.post('/admin/provider/assign', data);
}