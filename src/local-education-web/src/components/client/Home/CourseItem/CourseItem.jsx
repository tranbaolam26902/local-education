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
            <CardBody className='bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] sm:w-[30rem] rounded-xl p-8 border h-full flex flex-col'>
                <CardItem
                    as={Link}
                    to={`/courses/${course.urlSlug}`}
                    translateZ='50'
                    className='text-lg font-bold text-neutral-600 dark:text-white line-clamp-2 hover:opacity-70'
                >
                    {course.title}
                </CardItem>
                {course.description ? (
                    <div className='flex-grow'>
                        <CardItem
                            as='p'
                            translateZ='60'
                            className='text-neutral-500 text-sm mt-2 dark:text-neutral-300 line-clamp-4 mb-4'
                        >
                            {course.description}
                        </CardItem>
                    </div>
                ) : (
                    <CardItem as='p' className='line-clamp-4 text-sm mt-2 mb-4 opacity-0'>
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
                    className='w-full aspect-video object-cover rounded-xl group-hover/card:shadow-xl cursor-pointer'
                    alt={course.title}
                    onClick={handleNavigate}
                ></CardItem>
                <div className='flex justify-between items-center mt-8 px-4'>
                    <CardItem translateZ={50} className='rounded-xl text-sm font-semibold uppercase dark:text-white'>
                        {course.totalLesson} bài học
                    </CardItem>
                    <CardItem
                        as={Link}
                        to={`/courses/${course.urlSlug}`}
                        translateZ={50}
                        className='px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold hover:shadow-2xl hover:bg-opacity-70 dark:hover:bg-gray-200'
                    >
                        Xem chi tiết
                    </CardItem>
                </div>
            </CardBody>
        </CardContainer>
    );
}
