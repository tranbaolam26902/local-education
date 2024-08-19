/* Hooks */
import { useAxiosPrivate } from '@hooks/shared';

export default function useCourseServices() {
    /* Hooks */
    const axiosPrivate = useAxiosPrivate();

    const getCoursesByQueries = async (queries) => {
        const { data } = await axiosPrivate.get(`/api/courses/byAuthor?${queries}`);

        return data || null;
    };
    const getAllCourses = async () => {
        const { data } = await axiosPrivate.get('/api/courses/getAll');

        return data || null;
    };
    const addCourse = async (course) => {
        const { data } = await axiosPrivate.post('/api/courses', course);

        return data || null;
    };
    const updateCourse = async (course) => {
        const { data } = await axiosPrivate.put(`/api/courses/${course.id}`, course);

        return data || null;
    };
    const togglePublished = async (id) => {
        const { data } = await axiosPrivate.get(`/api/courses/togglePublish/${id}`);

        return data || null;
    };
    const toggleDeleted = async (id) => {
        const { data } = await axiosPrivate.delete(`/api/courses/toggleDelete/${id}`);

        return data || null;
    };
    const deleteCourse = async (id) => {
        const { data } = await axiosPrivate.delete(`/api/courses/${id}`);

        return data || null;
    };
    const enrollCourse = async (id) => {
        const { data } = await axiosPrivate.get(`/api/courses/takePartInCourse/${id}`);

        return data || null;
    };

    return {
        getCoursesByQueries,
        getAllCourses,
        addCourse,
        updateCourse,
        togglePublished,
        toggleDeleted,
        deleteCourse,
        enrollCourse
    };
}
