import ImagePicker, { ImageOrVideo, Options } from 'react-native-image-crop-picker';

export const isUrl = (url: string): boolean => {
  return url?.includes('http')
}

export const generateFile = (filePath: string, imageName?: string): File | null => {
  if (filePath) {
    return {
      name: imageName || 'enterus_media',
      uri: filePath,
      type: 'image/png' + filePath.split('.').reverse()[0],
    } as unknown as File
  } else {
    return null
  }
}

const config: Options = {
  width: 300,
  height: 300,
  cropping: true,
  compressImageQuality: 0.5,
  forceJpg: true,
}

export const image_picker = {
  camera: async (customConfig?: Options): Promise<ImageOrVideo> => {
    try {
      let result = await ImagePicker.openCamera({ ...config, ...(customConfig || {}) });
      return result
    } catch (error) {
      throw error;
    }

  },
  gallery: async (customConfig?: Options): Promise<ImageOrVideo> => {
    try {
      let result = await ImagePicker.openPicker({ ...config, ...(customConfig || {}) });
      return result
    } catch (error) {
      throw error;
    }
  }
}