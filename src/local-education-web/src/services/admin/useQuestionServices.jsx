/* Hooks */
import { useAxiosPrivate } from '@hooks/shared';

export default function useQuestionServices() {
    const axiosPrivate = useAxiosPrivate();

    const getSlideQuestions = async (slideId) => {
        const { data } = await axiosPrivate.get(`/api/questions/${slideId}`);

        return data || null;
    };
    const addOrUpdateQuestion = async (slideId, requiredCorrects, questions) => {
        const { data } = await axiosPrivate.post(`/api/questions/${slideId}/${requiredCorrects}`, questions);

        return data || null;
    };
    const exportQuestionsToExcel = async (questionData) => {
        const { data } = await axiosPrivate.post('/api/questions/exportQuestionsToExcel', questionData);

        return data || null;
    };
    const importQuestionsFromExcel = async (fileId) => {
        const { data } = await axiosPrivate.get(`/api/questions/importQuestionsFromExcel/${fileId}`);

        return data || null;
    };

    return { getSlideQuestions, addOrUpdateQuestion, exportQuestionsToExcel, importQuestionsFromExcel };
}
