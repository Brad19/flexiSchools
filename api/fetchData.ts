import axios from 'axios';

// API_KEY will be moved to env variables file in the pipeline. For test purpose of this repo, I'm adding the key here.
// const GIPHY_API_KEY = 'F8UnaUI8X3cdA05BqnauELral7mZWsLe'; // Got the api reached limit on this key
const GIPHY_API_KEY = 'fDuGJMtC0D2aCqekqXFkLlWvsF1eaWeY';
const GIPHY_BASE_URL = 'https://api.giphy.com/v1/gifs'

export type ResultType = {
    type: string;
    id: string;
    url: string;
    images:{
        fixed_height: {
            url: string;
        }
    },
    title: string;
}

export const getTrendingGifs = async (limit: number, offset: number) : Promise<ResultType[]> => {
    try {
        const GIPHY_TRENDING_URL = `${GIPHY_BASE_URL}/trending?api_key=${GIPHY_API_KEY}&limit=${limit}&&offset=${offset}&rating=g`;
        const response = await axios.get(GIPHY_TRENDING_URL);
        return response.data.data;
    } catch (error) {
        console.log('error in retrieveing GIF', error);
        throw error;
        // return [];
    }
}

export const getSearchGifs = async (query: string, limit: number, offset: number) : Promise<ResultType[]> => {
    try {
        const GIPHY_SEARCH_URL = `${GIPHY_BASE_URL}/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=${limit}&&offset=${offset}&rating=g`;
        const response = await axios.get(GIPHY_SEARCH_URL);
        return response.data.data;
    } catch (error) {
        console.log('error in retrieveing GIF', error);
        throw error;
    }
}