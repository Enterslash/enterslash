import { IProviderRequestModel, RequestToBeProviderDTO } from "@enterslash/enterus/types";
import $api from "./client";
import { toFormData } from "@enterslash/utils";

export const request_to_be_a_provider = (data: RequestToBeProviderDTO): Promise<IProviderRequestModel> => {
    const formData = toFormData<RequestToBeProviderDTO>(data, ["frontImage", "backImage"])
    return $api.post('/provider_request', formData);
}

export const get_provider_request_details = (): Promise<IProviderRequestModel> => {
    return $api.get('/provider_request');
}