import { CreateMessageDTO, GetConversationsDTO, GetLatestMessageDTO, GetMessageDTO, GetSingleMessageDTO, IMessageModel, IUserModel } from "@enterslash/enterus/types";
import $api from "./client";
import { toFormData } from "@enterslash/utils";

export const create_message = (data: CreateMessageDTO) : Promise<GetSingleMessageDTO> => {
    const formData = toFormData<CreateMessageDTO>(data, ['attachments'])
    return  $api.post('/message', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export const get_messages = (bookingId: string) : Promise<GetMessageDTO[]> => {
    return  $api.get(`/message/${bookingId}`);
}

export const get_latest_messages = (bookingId: string, data: GetLatestMessageDTO) : Promise<GetMessageDTO[]> => {
    return  $api.post(`/message/${bookingId}/latest`, data);
}