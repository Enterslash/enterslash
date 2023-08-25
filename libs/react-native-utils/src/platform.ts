import { Dimensions, Platform } from "react-native"

export const ScreenWidth = Dimensions.get('window').width
export const ScreenHeight = Dimensions.get('window').height
export const IsIos = Platform.OS === 'ios'
export const IsAndroid = Platform.OS === 'android'