/* Hooks */
import { useAxiosPrivate } from '@hooks/shared';

export default function useTourServices() {
    const axiosPrivate = useAxiosPrivate();

    const createTour = async (title) => {
        const { data } = await axiosPrivate.post('/api/tours', { title });

        return data || null;
    };

    const getToursByQueries = async (queries) => {
        const { data } = await axiosPrivate.get(`/api/tours/byUser?${queries}`);

        return data || null;
    };

    const changeTourTitleById = async (id, title) => {
        const { data } = await axiosPrivate.put(`/api/tours/${id}`, { title });

        return data || null;
    };

    const toggleTourPublishedStatusById = async (id) => {
        const { data } = await axiosPrivate.get(`/api/tours/togglePublish/${id}`);

        return data || null;
    };

    const toggleTourDeletedStatusById = async (id) => {
        const { data } = await axiosPrivate.delete(`/api/tours/toggleDelete/${id}`);

        return data || null;
    };

    const deleteTourById = async (id) => {
        const { data } = await axiosPrivate.delete(`/api/tours/delete/${id}`);

        return data || null;
    };

    const emptyTrash = async () => {
        const { data } = await axiosPrivate.delete('/api/tours/emptyRecycleBin');

        return data || null;
    };

    const updateTourMap = async (tourId, map) => {
        const { data } = await axiosPrivate.put(`/api/tours/atlasTour/${tourId}`, map);

        return data || null;
    };

    return {
        createTour,
        getToursByQueries,
        changeTourTitleById,
        toggleTourPublishedStatusById,
        toggleTourDeletedStatusById,
        deleteTourById,
        emptyTrash,
        updateTourMap
    };
}
