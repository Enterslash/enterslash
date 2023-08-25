import * as RNFS from 'react-native-fs';

export const toBase64 = async (file: string) => {
    const data = await RNFS.readFile(file, 'base64').then(res => { return res });
    return "data:image/jpeg;base64," + data;
}