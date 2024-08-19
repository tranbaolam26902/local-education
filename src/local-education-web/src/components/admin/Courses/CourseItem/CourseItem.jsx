/* Libraries */
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

/* Redux */
import { triggerUpdateCourses } from '@redux/features/admin/courseManagement';

/* Services */
import { useCourseServices } from '@services/admin';

export default function CourseItem({ course }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* Services */
    const courseServices = useCourseServices();

    /* Event handlers */
    const handleTogglePublished = async () => {
        const toggleResult = await courseServices.togglePublished(course.id);

        if (toggleResult.isSuccess) {
            toast.success('Chuyển trạng thái thành công.');
            dispatch(triggerUpdateCourses());
        } else toast.error('Chuyển trạng thái thất bại.');
    };
    const handleToggleDelete = async () => {
        const toggleResult = await courseServices.toggleDeleted(course.id);

        if (toggleResult.isSuccess) {
            if (course.isDeleted) toast.success('Khôi phục khoá học thành công.');
            else toast.success('Chuyển khoá học vào thùng rác thành công.');
            dispatch(triggerUpdateCourses());
        } else {
            if (course.isDeleted) toast.error('Khôi phục khoá học thất bại.');
            else toast.error('Chuyển khoá học vào thùng rác thất bại.');
        }
    };
    const handleDelete = async () => {
        if (!confirm('Tất cả bài học và slides liên quan đều sẽ bị mất. Xác nhận xoá khoá học?')) return;

        const deleteResult = await courseServices.deleteCourse(course.id);

        if (deleteResult.isSuccess) {
            toast.success('Xoá khoá học thành công.');
            dispatch(triggerUpdateCourses());
        } else toast.error('Xoá khoá học thất bại.');
    };

    return (
        <div className='grid grid-cols-12 p-2 odd:bg-gray-100 dark:odd:bg-dark'>
            <Link
                to={`/admin/courses/edit/${course.urlSlug}`}
                className='col-span-3 pr-1 font-semibold text-blue-500 underline hover:opacity-80'
            >
                {course.title}
            </Link>
            <div className='col-span-4 px-1'>
                <p className='line-clamp-4'>{course.description}</p>
            </div>
            <div className='col-span-2 px-1 text-center'>
                {course.urlPath ? (
                    <img
                        src={`${import.meta.env.VITE_API_ENDPOINT}/${course.thumbnailPath}`}
                        alt={course.title}
                        className='aspect-video object-center object-cover w-full rounded'
                    />
                ) : (
                    '(Trống)'
                )}
            </div>
            <div className='col-span-1 px-1 text-center'>
                {new Date(course.createdDate).toLocaleString('vi-VN', { dateStyle: 'short' })}
            </div>
            <div className='col-span-1 px-1 text-center'>{course.totalLesson}</div>
            <div className='col-span-1 flex flex-col gap-y-2 pl-1'>
                {course.isDeleted ? (
                    <>
                        <button
                            type='button'
                            className='py-2 h-fit font-semibold text-white bg-gray-400 rounded'
                            onClick={handleToggleDelete}
                        >
                            Khôi phục
                        </button>
                        <button
                            type='button'
                            className='py-2 h-fit font-semibold text-white bg-red-400 rounded'
                            onClick={handleDelete}
                        >
                            Xoá
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type='button'
                            title='Chuyển trạng thái'
                            className={`py-2 h-fit font-semibold text-white ${course.isPublished ? 'bg-blue-400' : 'bg-gray-400'
                                } rounded hover:opacity-80`}
                            onClick={handleTogglePublished}
                        >
                            {course.isPublished ? 'Công khai' : 'Riêng tư'}
                        </button>
                        <button
                            type='button'
                            className='py-2 h-fit font-semibold text-white bg-red-400 rounded hover:opacity-80'
                            onClick={handleToggleDelete}
                        >
                            Xoá
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
