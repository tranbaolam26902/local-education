/* Hooks */
import { useAxiosPrivate } from '@hooks/shared';

export default function useSlideServices() {
    const axiosPrivate = useAxiosPrivate();

    const getSlidesByLessonId = async (id) => {
        const { data } = await axiosPrivate.get(`/api/slides/list/${id}`);

        return data || null;
    };
    const getSlideById = async (id) => {
        const { data } = await axiosPrivate.get(`/api/slides/manager/${id}`);

        return data || null;
    };
    const addSlideToLesson = async (slide, lessonId) => {
        const { data } = await axiosPrivate.post(`/api/slides/${lessonId}`, slide);

        return data || null;
    };
    const togglePublished = async (id) => {
        const { data } = await axiosPrivate.get(`/api/slides/togglePublish/${id}`);

        return data || null;
    };
    const updateSlide = async (slide) => {
        const { data } = await axiosPrivate.put(`/api/slides/${slide.id}`, slide);

        return data || null;
    };
    const deleteSlide = async (id) => {
        const { data } = await axiosPrivate.delete(`/api/slides/${id}`);

        return data || null;
    };

    return { getSlidesByLessonId, getSlideById, addSlideToLesson, togglePublished, updateSlide, deleteSlide };
}
