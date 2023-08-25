import { HandleProviderRequestDTO, IProviderRequestModel } from "@enterslash/enterus/types";
import $api from "../client";

export const get_all_provider_requests = (): Promise<IProviderRequestModel[]> => {
    return $api.get('/admin/provider_requests');
}

export const handle_provider_requests = (id: string, data: HandleProviderRequestDTO) => {
    return $api.put(`/admin/provider_request/${id}`, data);
}