/* Hooks */
import { useAxiosPrivate } from '@hooks/shared';

export default function useDashboardServices() {
    /* Hooks */
    const axiosPrivate = useAxiosPrivate();

    const getQuantityStatistics = async () => {
        const { data } = await axiosPrivate.get(`/api/dashboard/QuantityStatistics`);

        return data || null;
    };

    const getCourseStatistics = async (time) => {
        const { data } = await axiosPrivate.post(`/api/dashboard/CourseChartStatistics`, time);

        return data || null;
    }

    const getTourStatistics = async (time) => {
        const { data } = await axiosPrivate.post(`/api/dashboard/TourChartStatistics`, time);

        return data || null;
    }

    const getFileStatistics = async (time) => {
        const { data } = await axiosPrivate.post(`/api/dashboard/FileChartStatistics`, time);

        return data || null;
    }

    return { getQuantityStatistics, getCourseStatistics, getTourStatistics, getFileStatistics};
}