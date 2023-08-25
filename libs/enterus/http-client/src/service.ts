import { GetMultiServicesDTO, GetSingleServiceDTO } from "@enterslash/enterus/types";
import $api from "./client";

export const get_services = () : Promise<GetMultiServicesDTO[]> => {
    return  $api.get('/services');
}

export const get_service = (id: string) : Promise<GetSingleServiceDTO> => {
    return  $api.get('/service/' + id);
}