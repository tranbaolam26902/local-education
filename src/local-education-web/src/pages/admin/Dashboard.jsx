/* Libraries */
import { useEffect, useRef, useState } from 'react';
// import * as Unicons from '@iconscout/react-unicons';

/* Services */
import { useDashboardServices } from '@services/admin';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { DashboardCards } from '@components/admin';
import { Container } from '@components/shared';

export default function Dashboard() {
    /* Services */
    const dashboardServices = useDashboardServices();

    /* States */
    // const [courseStatistics, setCourseStatistics] = useState([]);
    // const [lessonStatistics, setLessonStatistics] = useState([]);
    // const [slideStatistics, setSlideStatistics] = useState([]);
    // const [tourStatistics, setTourStatistics] = useState([]);
    // const [sceneStatistics, setSceneStatistics] = useState([]);
    // const [infoStatistics, setInfoStatistics] = useState([]);
    // const [linkStatistics, setLinkStatistics] = useState([]);
    // const [fileStatistics, setFileStatistics] = useState([]);
    // const [loading, setLoading] = useState(true);

    /* Refs */
    // const startDate = useRef();
    // const endDate = useRef();

    /* Functions */
    // const getHighChartData = (data) =>
    //     data
    //         .map((item) => {
    //             const dateParts = item.createdDate.split('/');
    //             const formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
    //
    //             return [new Date(formattedDate).getTime(), item.total];
    //         })
    //         .sort((a, b) => a[0] - b[0]);

    // const getCourseStatistics = async (startDate, endDate) => {
    //     const courseResult = await dashboardServices.getCourseStatistics({
    //         startDate: startDate,
    //         endDate: endDate
    //     });
    //
    //     if (courseResult.isSuccess) {
    //         setCourseStatistics(getHighChartData(courseResult.result.courses));
    //         setLessonStatistics(getHighChartData(courseResult.result.lessons));
    //         setSlideStatistics(getHighChartData(courseResult.result.slides));
    //     } else {
    //         setCourseStatistics([]);
    //         setLessonStatistics([]);
    //         setSlideStatistics([]);
    //     }
    // };

    // const getTourStatistics = async (startDate, endDate) => {
    //     const tourResult = await dashboardServices.getTourStatistics({
    //         startDate: startDate,
    //         endDate: endDate
    //     });
    //
    //     if (tourResult.isSuccess) {
    //         setTourStatistics(getHighChartData(tourResult.result.tours));
    //         setSceneStatistics(getHighChartData(tourResult.result.scenes));
    //         setLinkStatistics(getHighChartData(tourResult.result.linkHotspots));
    //         setInfoStatistics(getHighChartData(tourResult.result.infoHotspots));
    //     } else {
    //         setTourStatistics([]);
    //         setSceneStatistics([]);
    //         setLinkStatistics([]);
    //         setInfoStatistics([]);
    //     }
    // };

    // const getFileStatistics = async (startDate, endDate) => {
    //     const fileResult = await dashboardServices.getFileStatistics({
    //         startDate: startDate,
    //         endDate: endDate
    //     });
    //
    //     if (fileResult.isSuccess) {
    //         setFileStatistics(getHighChartData(fileResult.result.files));
    //     } else {
    //         setFileStatistics([]);
    //     }
    // };

    /* Event handlers */
    // const handleFilter = (e) => {
    //     e.preventDefault();
    //
    //     getCourseStatistics(startDate.current.value, endDate.current.value);
    //     getTourStatistics(startDate.current.value, endDate.current.value);
    //     getFileStatistics(startDate.current.value, endDate.current.value);
    // };

    /* Side effects */
    // useEffect(() => {
    //     getCourseStatistics(startDate.current.value, endDate.current.value);
    //     getTourStatistics(startDate.current.value, endDate.current.value);
    //     getFileStatistics(startDate.current.value, endDate.current.value);
    //
    //     setLoading(false);
    // }, []);

    /* Chart options */
    // const courseOptions = {
    //     title: {
    //         text: 'Thống kê khóa học'
    //     },
    //     series: [
    //         {
    //             name: 'Khóa học',
    //             data: courseStatistics,
    //             type: 'spline',
    //             color: '#FBA834',
    //             lineWidth: 2.75
    //         },
    //         {
    //             name: 'Bài học',
    //             data: lessonStatistics,
    //             type: 'spline',
    //             color: '#2ab7ca',
    //             lineWidth: 2.75
    //         },
    //         {
    //             name: 'Nội dung',
    //             data: slideStatistics,
    //             type: 'spline',
    //             color: '#fe4a49',
    //             lineWidth: 2.75
    //         }
    //     ],
    //     navigator: {
    //         series: [
    //             {
    //                 data: courseStatistics,
    //                 type: 'spline',
    //                 fillOpacity: 0,
    //                 marker: {
    //                     enabled: false
    //                 },
    //                 lineColor: '#FBA834',
    //                 lineWidth: 1
    //             },
    //             {
    //                 data: lessonStatistics,
    //                 type: 'spline',
    //                 fillOpacity: 0,
    //                 marker: {
    //                     enabled: true
    //                 },
    //                 lineColor: '#2ab7ca',
    //                 lineWidth: 1
    //             },
    //             {
    //                 data: slideStatistics,
    //                 type: 'spline',
    //                 fillOpacity: 0,
    //                 marker: {
    //                     enabled: true
    //                 },
    //                 lineColor: '#fe4a49',
    //                 lineWidth: 1
    //             }
    //         ]
    //     }
    // };

    // const tourOptions = {
    //     title: {
    //         text: 'Thống kê tours vr'
    //     },
    //     series: [
    //         {
    //             name: 'Tour',
    //             data: tourStatistics,
    //             type: 'spline',
    //             color: '#FBA834',
    //             lineWidth: 2.75
    //         },
    //         {
    //             name: 'Địa điểm',
    //             data: sceneStatistics,
    //             type: 'spline',
    //             color: '#2ab7ca',
    //             lineWidth: 2.75
    //         },
    //         {
    //             name: 'Liên kết',
    //             data: linkStatistics,
    //             type: 'spline',
    //             color: '#fe4a49',
    //             lineWidth: 2.75
    //         },
    //
    //         {
    //             name: 'Thông tin chi tiết',
    //             data: infoStatistics,
    //             type: 'spline',
    //             color: '#4ade80',
    //             lineWidth: 2.75
    //         }
    //     ],
    //     navigator: {
    //         series: [
    //             {
    //                 data: tourStatistics,
    //                 type: 'spline',
    //                 fillOpacity: 0,
    //                 marker: {
    //                     enabled: false
    //                 },
    //                 lineColor: '#FBA834',
    //                 lineWidth: 1
    //             },
    //             {
    //                 data: sceneStatistics,
    //                 type: 'spline',
    //                 fillOpacity: 0,
    //                 marker: {
    //                     enabled: true
    //                 },
    //                 lineColor: '#2ab7ca',
    //                 lineWidth: 1
    //             },
    //             {
    //                 data: linkStatistics,
    //                 type: 'spline',
    //                 fillOpacity: 0,
    //                 marker: {
    //                     enabled: true
    //                 },
    //                 lineColor: '#fe4a49',
    //                 lineWidth: 1
    //             },
    //
    //             {
    //                 data: infoStatistics,
    //                 type: 'spline',
    //                 fillOpacity: 0,
    //                 marker: {
    //                     enabled: true
    //                 },
    //                 lineColor: '#4ade80',
    //                 lineWidth: 1
    //             }
    //         ]
    //     }
    // };
    //
    // const fileOptions = {
    //     title: {
    //         text: 'Thống kê tập tin'
    //     },
    //     series: {
    //         name: 'Dung lượng tập tin (MB)',
    //         data: fileStatistics,
    //         type: 'spline',
    //         color: '#FBA834',
    //         lineWidth: 2.75
    //     },
    //     navigator: {
    //         series: {
    //             data: fileStatistics,
    //             type: 'spline',
    //             fillOpacity: 0,
    //             marker: {
    //                 enabled: false
    //             },
    //             lineColor: '#FBA834',
    //             lineWidth: 1
    //         }
    //     }
    // };
    // const setPageTitle = () => {
    //     document.title = getSubPageTitle('Dashboard');
    // };

    /* Side effects */
    /* Init component side effects */
    // useEffect(() => {
    //     setPageTitle();
    // }, []);

    return (
        <section className='min-h-[calc(100svh-3.75rem)] dark:bg-black dark:text-white'>
            <Container className='flex flex-col gap-4 py-4'>
                <h1 className='text-2xl font-semibold'>Dashboard</h1>
                {/* Card quantity */}
                <DashboardCards />
                {/* <div className='flex max-h-[48px]'> */}
                {/*     <input */}
                {/*         className='rounded border border-gray-400 px-2 shadow-inner dark:bg-dark dark:text-white dark:[color-scheme:dark]' */}
                {/*         ref={startDate} */}
                {/*         type='date' */}
                {/*         defaultValue={new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)} */}
                {/*     /> */}
                {/*     <input */}
                {/*         className='mx-4 rounded border border-gray-400 p-2 shadow-inner dark:bg-dark dark:text-white dark:[color-scheme:dark]' */}
                {/*         ref={endDate} */}
                {/*         type='date' */}
                {/*         defaultValue={new Date().toISOString().substring(0, 10)} */}
                {/*     /> */}
                {/**/}
                {/*     <button */}
                {/*         type='button' */}
                {/*         className='flex items-center gap-x-1 rounded border border-gray-400 bg-nature-green px-4 py-2 text-white shadow-inner hover:opacity-80' */}
                {/*         onClick={(e) => handleFilter(e)} */}
                {/*     > */}
                {/*         <Unicons.UilFilter size='24' /> */}
                {/*         <span>Lọc</span> */}
                {/*     </button> */}
                {/* </div> */}
                {/* {loading ? ( */}
                {/*     <Unicons.UilSpinner */}
                {/*         size='48' */}
                {/*         className='animate-infinite animate-duration-1000 mx-auto animate-spin dark:text-white' */}
                {/*     /> */}
                {/* ) : ( */}
                {/*     <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'> */}
                {/*         <StockChart chartOptions={courseOptions} /> */}
                {/*         <StockChart chartOptions={tourOptions} /> */}
                {/*     </div> */}
                {/* )} */}

                {/* {loading ? ( */}
                {/*     <Unicons.UilSpinner */}
                {/*         size='48' */}
                {/*         className='animate-infinite animate-duration-1000 mx-auto animate-spin dark:text-white' */}
                {/*     /> */}
                {/* ) : ( */}
                {/*     <StockChart chartOptions={fileOptions} /> */}
                {/* )} */}
            </Container>
        </section>
    );
}
