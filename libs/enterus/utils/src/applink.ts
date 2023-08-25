export const AppLinks = {
    chatOptions: (id?: string) => `chat_options/${id || ':bookingId'}`,
    message: (id?: string) => `message/${id || ':bookingId'}`,
    order: () => `orders`,
    settings: () => `settings`,
    root: () => `root`
};