/* Hooks */
import { useAxiosPrivate } from '@hooks/shared';

export default function useLessonServices() {
    /* Hooks */
    const axiosPrivate = useAxiosPrivate();

    const getLessonsByCourseId = async (id) => {
        const { data } = await axiosPrivate.get(`/api/lessons/manager/getLessons/${id}`);

        return data || null;
    };
    const addLesson = async (lesson, courseId) => {
        const { data } = await axiosPrivate.post(`/api/lessons/${courseId}`, lesson);

        return data || null;
    };
    const updateLesson = async (lesson) => {
        const { data } = await axiosPrivate.put(`/api/lessons/${lesson.id}`, lesson);

        return data || null;
    };
    const togglePublished = async (id) => {
        const { data } = await axiosPrivate.get(`/api/lessons/togglePublish/${id}`);

        return data || null;
    };
    const deleteLesson = async (id) => {
        const { data } = await axiosPrivate.delete(`/api/lessons/${id}`);

        return data || null;
    };

    return { getLessonsByCourseId, addLesson, updateLesson, togglePublished, deleteLesson };
}
