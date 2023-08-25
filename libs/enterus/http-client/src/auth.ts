import { AuthSuccessDTO, LoginDTO, RegisterDTO } from "@enterslash/enterus/types";
import $api from "./client";

export const login = (data: LoginDTO) : Promise<AuthSuccessDTO> => {
    return  $api.post('/auth/login', data);
}

export const log_out = () : Promise<string> => {
    return  $api.post('/auth/logout');
}

export const registration = (data: RegisterDTO) : Promise<AuthSuccessDTO> => {
    return  $api.post('/auth/registration', data);
}