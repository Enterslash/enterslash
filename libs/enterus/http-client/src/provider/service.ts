import { IProviderServiceModel, ProviderServiceStatus, StartServiceDTO } from "@enterslash/enterus/types";
import $api from "../client";

export const start_service = (id: string, data: StartServiceDTO) => {
    return $api.post(`/provider/service/${id}/start`, data);
}

export const get_my_service_requests = (): Promise<IProviderServiceModel[]> => {
    return $api.get(`/provider/service_requests`);
}

export const get_single_service_request = (id: string): Promise<IProviderServiceModel> => {
    return $api.get(`/provider/service_request/${id}`);
}

export const change_service_status = (id: string, status: ProviderServiceStatus) => {
    return $api.put(`/provider/service_request/${id}/${status}`);
}