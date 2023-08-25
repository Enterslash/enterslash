export const toFormData = <T>(data: any, files: (keyof T)[]) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value) {
            if (files.includes(key as keyof T)) {
                if (Array.isArray(value)) {
                    value.forEach((file) => {
                        formData.append(key, file);
                    });
                } else {
                    formData.append(key, value as any);
                }
            } else if (typeof value === 'object' || Array.isArray(value)) {
                formData.append(key, JSON.stringify(value));
            } else {
                formData.append(key, value as any);
            }
        }
    });
    return formData;
};
