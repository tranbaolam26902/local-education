/* Libraries */
import axios from './axios';

const getSlideById = async (id) => {
    const { data } = await axios.get(`/api/slides/${id}`);

    return data || null;
};
const getSlidesByLessonId = async (id) => {
    const { data } = await axios.get(`/api/slides/list/${id}`);

    return data || null;
};

export { getSlideById, getSlidesByLessonId };
