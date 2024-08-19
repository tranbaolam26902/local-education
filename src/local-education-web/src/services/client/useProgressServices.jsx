/* Hooks */
import { useAxiosPrivate } from '@hooks/shared';

export default function useProgressServices() {
    const axiosPrivate = useAxiosPrivate();

    const getProgress = async () => {
        const { data } = await axiosPrivate.get('/api/progress');

        return data || null;
    };
    const getProgressById = async (id) => {
        const { data } = await axiosPrivate.get(`/api/progress/${id}`);

        return data || null;
    };
    const completeSlide = async (id, answers = []) => {
        const { data } = await axiosPrivate.post(`/api/progress/completed/${id}`, answers);

        return data || null;
    };
    const getCompletePercentage = async (id) => {
        const { data } = await axiosPrivate.get(`/api/progress/completionPercentage/${id}`);

        return data || null;
    };

    return { getProgress, getProgressById, completeSlide, getCompletePercentage };
}
