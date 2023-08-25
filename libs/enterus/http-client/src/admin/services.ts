import { ChangeServiceStatusDTO, CreateServiceDTO, GetMultiServicesDTO, ServiceStatus } from "@enterslash/enterus/types";
import $api from "../client";
import { toFormData } from "@enterslash/utils";


export const get_all_services = () : Promise<GetMultiServicesDTO[]> => {
    return  $api.get('/admin/services');
}


export const create_service = (data: CreateServiceDTO): Promise<any> => {
    const formData = toFormData<CreateServiceDTO>(data, ["cover"])
    return $api.post('/admin/service', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const edit_service = (id: string, data: CreateServiceDTO): Promise<any> => {
    const formData = toFormData<CreateServiceDTO>(data, ["cover"])
    return $api.put(`/admin/service/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const update_service_status = (id: string, data: ChangeServiceStatusDTO): Promise<any> => {
    return $api.put(`/admin/service/${id}/status`, data);
}