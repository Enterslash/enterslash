import { DocumentType, ProviderRequestStatus } from "../models";

export type RequestToBeProviderDTO = {
    idType: DocumentType,
    frontImage: File,
    backImage: File,
}

export type HandleProviderRequestDTO = {
    status: ProviderRequestStatus
}