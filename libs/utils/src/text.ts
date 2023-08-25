export const sliceText = (text?: string, sliceNumber = 14): string => {
  if (!text) return "";
  if (text?.length < sliceNumber) return text;
  return text?.slice(0, sliceNumber) + '...';
};

export const snackToNormalText = (text?: string) => {
  if (!text) return null;
  return text?.replace(/_/g, ' ');
}

export const toNormalText = (text?: string) => {
  if (!text) return null;
  const lowercase = text?.replace(/_/g, ' ').toLowerCase();
  return lowercase?.charAt(0).toUpperCase() + lowercase?.slice(1);
}