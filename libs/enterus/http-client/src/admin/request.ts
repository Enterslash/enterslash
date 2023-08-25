import { GetProviderServiceDTO, HandleServiceRequestDTO } from "@enterslash/enterus/types";
import $api from "../client";

export const get_requests = (): Promise<GetProviderServiceDTO[]> => {
    return $api.get('/admin/requests');
}

export const handle_requests = (data: HandleServiceRequestDTO) => {
    return $api.put('/admin/request', data);
}