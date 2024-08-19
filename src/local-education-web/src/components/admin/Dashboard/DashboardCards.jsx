/* Libraries */
import React, { useEffect, useState } from 'react';
import * as Unicons from '@iconscout/react-unicons';

/* Services */
import { useDashboardServices } from '@services/admin';

function Card({ loading, text, value, icon }) {
    return (
        <div className='flex items-center bg-white border dark:border-gray-500 rounded overflow-hidden shadow dark:bg-dark'>
            <div className='p-4 bg-nature-green'>{icon}</div>
            <div className='px-4 text-gray-700 dark:text-white'>
                <h3 className='text-sm tracking-wider'>{text}</h3>
                <p className='text-3xl'>{loading ? '0' : value}</p>
            </div>
        </div>
    );
}

export default function DashboardCards() {
    /* Services */
    const dashboardServices = useDashboardServices();

    /* States */
    const [statistics, setStatistic] = useState({});
    const [loading, setLoading] = useState(true);

    /* Functions */
    const getStatistics = async () => {
        const quantityStatistics = await dashboardServices.getQuantityStatistics();

        if (quantityStatistics.isSuccess) {
            setStatistic(quantityStatistics.result);
            setLoading(false);
        } else {
            setStatistic({});
            setLoading(true);
        }
    };

    /* Side effects */
    /* Get all courses for select */
    useEffect(() => {
        getStatistics();
    }, []);

    return (
        <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
            <Card
                loading={loading}
                text='Tổng số khóa học'
                value={statistics.totalCourses}
                icon={<Unicons.UilBookOpen size='48' className='text-white' />}
            />
            <Card
                loading={loading}
                text='Tổng số Tour VR'
                value={statistics.totalTours}
                icon={<Unicons.UilVideo size='48' className='text-white' />}
            />
            <Card
                loading={loading}
                text='Tổng số tài khoản'
                value={statistics.totalUsers}
                icon={<Unicons.UilUser size='48' className='text-white' />}
            />
            <Card
                loading={loading}
                text='Lượt xem khóa học'
                value={statistics.totalCourseViews}
                icon={<Unicons.UilEye size='48' className='text-white' />}
            />
            <Card
                loading={loading}
                text='Lượt xem Tour VR'
                value={statistics.totalTourViews}
                icon={<Unicons.UilEye size='48' className='text-white' />}
            />
        </section>
    );
}
