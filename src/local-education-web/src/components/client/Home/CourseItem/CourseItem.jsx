/* Libraries */
import { Link, useNavigate } from 'react-router-dom';

/* Components */
import { CardBody, CardContainer, CardItem } from '@components/shared';

export default function CourseItem({ course }) {
    /* Hooks */
    const navigate = useNavigate();

    /* Event handlers */
    const handleNavigate = () => {
        navigate(`/courses/${course.urlSlug}`);
    };
    return (
        <CardContainer containerClassName='h-full'>
            <CardBody className='group/card relative flex h-full flex-col rounded-xl border border-black/[0.1] bg-white p-8 dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] sm:w-[30rem]'>
                <CardItem
                    as={Link}
                    to={`/courses/${course.urlSlug}`}
                    translateZ='50'
                    className='line-clamp-2 text-lg font-bold text-neutral-600 hover:opacity-70 dark:text-white'
                >
                    {course.title}
                </CardItem>
                {course.description ? (
                    <div className='flex-grow'>
                        <CardItem
                            as='p'
                            translateZ='60'
                            className='mb-4 mt-2 line-clamp-4 text-sm text-neutral-500 dark:text-neutral-300'
                        >
                            {course.description}
                        </CardItem>
                    </div>
                ) : (
                    <CardItem as='p' className='mb-4 mt-2 line-clamp-4 text-sm opacity-0'>
                        Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad
                        nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia.
                        Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla
                        est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat
                        reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa
                        proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua
                        reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat
                        ullamco ut ea consectetur et est culpa et culpa duis.
                    </CardItem>
                )}
                <CardItem
                    as='img'
                    translateZ={100}
                    src={`${import.meta.env.VITE_API_ENDPOINT}/${course.urlPath}`}
                    className='aspect-video w-full cursor-pointer rounded-xl object-cover group-hover/card:shadow-xl'
                    alt={course.title}
                    onClick={handleNavigate}
                ></CardItem>
                <div className='mt-8 flex items-center justify-between px-4'>
                    <CardItem
                        translateZ={50}
                        className='rounded-xl text-sm font-semibold uppercase opacity-0 dark:text-white'
                    >
                        {course.totalLesson} bài học
                    </CardItem>
                    <CardItem
                        as={Link}
                        to={`/courses/${course.urlSlug}`}
                        translateZ={50}
                        className='rounded-xl bg-black px-4 py-2 text-xs font-bold text-white hover:bg-opacity-70 hover:shadow-2xl dark:bg-white dark:text-black dark:hover:bg-gray-200'
                    >
                        Xem chi tiết
                    </CardItem>
                </div>
            </CardBody>
        </CardContainer>
    );
}
