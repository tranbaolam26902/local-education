/* Libraries */
import axios from './axios';

const getCoursesByQueries = async (queries) => {
    const { data } = await axios.get(`/api/courses?${queries}`);

    return data || null;
};
const getCourseBySlug = async (slug) => {
    const { data } = await axios.get(`/api/courses/bySlug/${slug}`);

    return data || null;
};
const getFeaturedCourses = async (number) => {
    const { data } = await axios.get(`/api/courses/related/${number}`);

    return data || null;
}

export { getCoursesByQueries, getCourseBySlug, getFeaturedCourses };
