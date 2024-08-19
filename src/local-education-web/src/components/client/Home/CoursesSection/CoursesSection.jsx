/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';
import ScrollAnimation from 'react-animate-on-scroll';

/* Services */
import { getFeaturedCourses } from '@services/shared';

/* Components */
import { ClientHomeCourseItem } from '@components/client';

export default function CoursesSection() {
    /* States */
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    /* Refs */
    const containerRef = useRef(null);

    /* Functions */
    const getCourses = async () => {
        const coursesResult = await getFeaturedCourses(4);

        if (coursesResult.isSuccess) setCourses(coursesResult.result);
        else setCourses([]);
        setIsLoading(false);
    };

    /* Event handlers */
    const handleNextSection = () => {
        window.scrollTo(0, containerRef.current.clientHeight + containerRef.current.offsetTop);
    };

    /* Side effects */
    useEffect(() => {
        getCourses();
    }, []);

    return (
        <section ref={containerRef} className='bg-gray-100 dark:bg-black min-h-[100svh]'>
            <div className='mx-auto px-6 min-h-[100svh]'>
                <div className='flex flex-col justify-center gap-y-8 md:gap-y-16 py-8 md:py-16 w-full min-h-[100svh]'>
                    <ScrollAnimation animateIn='fadeInUp' duration={0.8} offset={0} animateOnce>
                        <h1 className='font-bold text-2xl md:text-3xl text-center uppercase'>Khóa học nổi bật</h1>
                    </ScrollAnimation>
                    <div className='flex flex-col gap-y-6'>
                        {isLoading ? (
                            <Unicons.UilSpinner
                                size='48'
                                className='animate-spin animate-infinite animate-duration-1000 mx-auto dark:text-white'
                            />
                        ) : (
                            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4'>
                                {courses.map((course, index) => (
                                    <ScrollAnimation
                                        key={course.id}
                                        animateIn='fadeInUp'
                                        duration={0.8}
                                        delay={index * 50 || 50}
                                        offset={0}
                                        animateOnce
                                    >
                                        <ClientHomeCourseItem course={course} />
                                    </ScrollAnimation>
                                ))}
                            </div>
                        )}
                        <ScrollAnimation
                            animateIn='fadeIn'
                            duration={0.8}
                            delay={300}
                            offset={0}
                            animateOnce
                            className='self-center xl:self-end'
                        >
                            <Link
                                to='/courses'
                                className='flex items-center xl:mr-1 font-semibold text-sm uppercase hover:animate-float-right'
                            >
                                <span>Xem thêm</span>
                                <Unicons.UilAngleRight size='28' />
                            </Link>
                        </ScrollAnimation>
                    </div>
                    {/* <ScrollAnimation animateIn='fadeInUp' duration={0.8} delay={300} offset={0}>
                        <button
                            type='button'
                            className='flex flex-col items-center mx-auto mt-4 w-fit font-semibold md:text-lg dark:text-white uppercase animate-float'
                            onClick={handleNextSection}
                        >
                            <span>Tiếp tục</span>
                            <Unicons.UilAngleDown size='48' />
                        </button>
                    </ScrollAnimation> */}
                </div>
            </div>
        </section>
    );
}
