export const success = ({ data, message }: {
    data?: object,
    message?: string
}) => {
    return data || message
}

export const failed = ({ issue }) => {
    return { message: issue }
}