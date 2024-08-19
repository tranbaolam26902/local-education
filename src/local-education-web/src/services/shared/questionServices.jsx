/* Libraries */
import axios from './axios';

const getSlideQuestions = async (slideId) => {
    const { data } = await axios.get(`/api/questions/${slideId}`);

    return data || null;
};

export { getSlideQuestions };
