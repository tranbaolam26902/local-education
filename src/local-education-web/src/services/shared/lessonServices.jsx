/* Libraries */
import axios from './axios';

const getLessonById = async (id) => {
    const { data } = await axios.get(`/api/lessons/${id}`);

    return data || null;
};
const getLessonsByCourseSlug = async (slug) => {
    const { data } = await axios.get(`/api/lessons/getLessons/${slug}`);

    return data || null;
};

export { getLessonById, getLessonsByCourseSlug };
