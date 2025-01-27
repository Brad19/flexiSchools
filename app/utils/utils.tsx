import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        return error;
      }
}

export const getData = async (key: string) => {
    try {
        const result = await AsyncStorage.getItem(key);
        if (result) {
            return JSON.parse(result);
        }
        return undefined   
    } catch (error) {
        return error;
    }
}

export const removeData = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        return error;
    }
}