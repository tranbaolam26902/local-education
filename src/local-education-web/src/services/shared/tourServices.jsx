/* Libraries */
import axios from './axios';

const getToursByQueries = async (queries) => {
    const { data } = await axios.get(`/api/tours?${queries}`);

    return data || null;
};
const getTourBySlug = async (slug) => {
    const { data } = await axios.get(`/api/tours/bySlug/${slug}`);

    return data || null;
};
const getScenesByKeyword = async (keyword, slug) => {
    const { data } = await axios.get(`/api/scenes?Keyword=${keyword}&TourSlug=${slug}`);

    return data || null;
};

export { getToursByQueries, getTourBySlug, getScenesByKeyword };
