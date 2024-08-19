/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, easeInOut, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Unicons from '@iconscout/react-unicons';
import * as uuid from 'uuid';

/* Redux */
import {
    addOrUpdateInfoHotspot,
    disableIsNewInfoHotspot,
    editScene,
    enabledHasChangesScenes,
    hideInfoHotspotPane,
    resetCurrentDestinationLessonId,
    resetCurrentInfoHotspot,
    resetLessonParentCourseId,
    selectEditTour,
    selectInfoHotspot,
    selectPaneManagement,
    setCurrentDestinationLessonId,
    setCurrentEditingScene,
    setCurrentInfoHotspot,
    setLessonParentCourseId,
    showInfoHotspotPane
} from '@redux/features/admin/editTour';

/* Services */
import { useCourseServices, useLessonServices } from '@services/admin';
import { getLessonById } from '@services/shared';

/* Components */
import { Input } from '@components/admin';
import LessonItem from '../LessonItem/LessonItem';

export default function InfoHotspotPane({ viewerRef }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const paneManagement = useSelector(selectPaneManagement);
    const editTour = useSelector(selectEditTour);
    const infoHotspot = useSelector(selectInfoHotspot);
    const [courses, setCourses] = useState([]);
    const [courseId, setCourseId] = useState(uuid.NIL);
    const [lessons, setLessons] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    /* Refs */
    const selectCourseRef = useRef(null);
    const searchInputRef = useRef(null);

    /* Services */
    const courseServices = useCourseServices();
    const lessonServices = useLessonServices();

    /* Functions */
    const getAllCourses = async () => {
        const coursesResult = await courseServices.getAllCourses();

        if (coursesResult.isSuccess) setCourses(coursesResult.result);
        else setCourses([]);
    };
    const getLessons = async (id) => {
        if (id === uuid.NIL) return;

        const lessonsResult = await lessonServices.getLessonsByCourseId(id);

        if (lessonsResult.isSuccess) setLessons(lessonsResult.result);
        else setLessons([]);
    };
    const validateInfoHotspot = () => {
        if (editTour.currentDestinationLessonId === uuid.NIL) {
            toast.warn('Vui lòng chọn bài học.');
            return false;
        }
        return true;
    };
    const handleCloseInfoHotspot = () => {
        dispatch(disableIsNewInfoHotspot());
        dispatch(hideInfoHotspotPane());
        dispatch(resetCurrentInfoHotspot());
        dispatch(resetLessonParentCourseId());
        dispatch(resetCurrentDestinationLessonId());

        setSearchTerm('');
        setCourseId(uuid.NIL);
    };
    /* Allow new info hotspots added into scene can be edit  */
    const addEventForAddedInfoHotspots = (destinationLessonId, lessonParentCourseId) => {
        viewerRef.current.panorama.children.forEach((hotspot) => {
            if (hotspot.infoId === infoHotspot.currentInfoHotspot.infoId) {
                hotspot.addEventListener('touchstart', () => {
                    dispatch(
                        setCurrentInfoHotspot({
                            ...infoHotspot.currentInfoHotspot,
                            lessonId: destinationLessonId
                        })
                    );
                    dispatch(setLessonParentCourseId(lessonParentCourseId));
                    dispatch(setCurrentDestinationLessonId(destinationLessonId));
                    dispatch(showInfoHotspotPane());
                    hotspot.focus();
                });
                hotspot.addEventListener('click', () => {
                    dispatch(
                        setCurrentInfoHotspot({
                            ...infoHotspot.currentInfoHotspot,
                            lessonId: destinationLessonId
                        })
                    );
                    dispatch(setLessonParentCourseId(lessonParentCourseId));
                    dispatch(setCurrentDestinationLessonId(destinationLessonId));
                    dispatch(showInfoHotspotPane());
                    hotspot.focus();
                });
            }
        });
    };

    /* Event handlers */
    const handleSelectCourse = (e) => {
        setCourseId(e.target.value);
        if (e.target.value === uuid.NIL) {
            setLessons([]);
            return;
        } else dispatch(setLessonParentCourseId(e.target.value));
    };
    const handleCancelEditInfoHotspot = () => {
        // Remove hotspot from panorama
        if (infoHotspot.isNewHotspot)
            viewerRef.current.panorama.children.forEach((spot) => {
                if (spot.infoId === infoHotspot.currentInfoHotspot.infoId) {
                    spot.dispose();
                }
            });

        handleCloseInfoHotspot();
    };
    const handleDeleteInfoHotspot = () => {
        // Remove hotspot from panorama
        viewerRef.current.panorama.children.forEach((spot) => {
            if (spot.infoId === infoHotspot.currentInfoHotspot.infoId) {
                spot.dispose();
            }
        });

        const newScene = {
            ...editTour.currentScene,
            infoHotspots: [
                ...editTour.currentScene.infoHotspots.filter(
                    (spot) => spot.infoId !== infoHotspot.currentInfoHotspot.infoId
                )
            ]
        };
        dispatch(editScene(newScene));
        dispatch(setCurrentEditingScene(newScene));

        dispatch(enabledHasChangesScenes());
        handleCloseInfoHotspot();
    };
    const handleSaveInfoHotspot = async () => {
        if (!validateInfoHotspot()) return;

        const currentScene = editTour.editingTour.scenes.find((scene) => scene.index === editTour.currentScene.index);
        if (!currentScene) {
            alert('Không có địa điểm phù hợp, vui lòng thử lại.');
            return;
        }

        const destinationLessonId = editTour.currentDestinationLessonId;
        const lessonParentCourseId = editTour.lessonParentCourseId;
        const lesson = await getLessonById(destinationLessonId); // Set title and description to infohotspots for searching

        dispatch(
            addOrUpdateInfoHotspot({
                sceneIndex: editTour.currentScene.index,
                infoHotspot: {
                    ...infoHotspot.currentInfoHotspot,
                    lessonId: destinationLessonId,
                    title: lesson.result.title,
                    description: lesson.result.description
                }
            })
        );

        addEventForAddedInfoHotspots(destinationLessonId, lessonParentCourseId);

        dispatch(enabledHasChangesScenes());
        handleCloseInfoHotspot();
    };

    /* Side effects */
    /* Get all courses for select */
    useEffect(() => {
        getAllCourses();
    }, []);
    /* Get selected course lessons */
    useEffect(() => {
        getLessons(courseId);
    }, [courseId]);
    /* Bind course id for editing info hotspot */
    useEffect(() => {
        if (editTour.currentDestinationLessonId === uuid.NIL) return;

        if (editTour.lessonParentCourseId === uuid.NIL) {
            courses.forEach(async (course) => {
                const lessonsResult = await lessonServices.getLessonsByCourseId(course.id);
                if (lessonsResult.isSuccess)
                    lessonsResult.result.forEach((lesson) => {
                        if (lesson.id === editTour.currentDestinationLessonId)
                            dispatch(setLessonParentCourseId(course.id));
                    });
            });
        } else {
            setCourseId(editTour.lessonParentCourseId);
            selectCourseRef.current.value = editTour.lessonParentCourseId;
        }
    }, [editTour.lessonParentCourseId, editTour.currentDestinationLessonId]);

    return (
        <AnimatePresence>
            {paneManagement.isShowInfoHotspotPane && (
                <motion.section
                    initial={{ x: '100%', transition: { duration: 0.2, ease: easeInOut } }}
                    animate={{ x: '0', transition: { duration: 0.2, ease: easeInOut } }}
                    exit={{ x: '100%', transition: { duration: 0.2, ease: easeInOut } }}
                    className={`absolute top-0 right-0 bottom-0 flex flex-col w-96 max-w-[80vw] h-full bg-white dark:bg-black border-l dark:border-gray-400`}
                >
                    {/* Start: Content section */}
                    <section className='flex-grow flex flex-col gap-y-4 overflow-y-auto px-6 pt-4 pb-0'>
                        <h1 className='font-bold text-2xl'>Chỉnh sửa điểm thông tin</h1>
                        {/* Start: Select course section */}
                        <div className='flex flex-col gap-y-2'>
                            <span className='font-semibold'>Chọn khóa học</span>
                            <select
                                ref={selectCourseRef}
                                className={`px-4 py-2 w-full h-full bg-white border ${false ? 'border-red-400' : 'border-gray-400'
                                    } rounded shadow-inner appearance-none dark:bg-dark`}
                                onChange={handleSelectCourse}
                                defaultValue={uuid.NIL}
                            >
                                <option value={uuid.NIL}>-- Chọn khóa học --</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* End: Select course section */}

                        {/* Start: Destination Scene section */}
                        {courseId !== uuid.NIL && (
                            <div className='flex-grow flex flex-col gap-y-2 overflow-y-auto'>
                                <h2 className='font-semibold text-lg'>Chọn chương</h2>
                                <Input
                                    ref={searchInputRef}
                                    placeholder='Tìm kiếm...'
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value.trim());
                                    }}
                                    clearInput={() => {
                                        setSearchTerm('');
                                    }}
                                />
                                <div className='flex-grow flex flex-col gap-y-2 overflow-y-auto pb-8 no-scrollbar'>
                                    {lessons
                                        .filter((lesson) =>
                                            lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((lesson) => (
                                            <LessonItem
                                                key={lesson.id}
                                                lesson={lesson}
                                                isUsed={
                                                    lesson.tourSlug && lesson.tourSlug !== editTour.editingTour.urlSlug
                                                }
                                            />
                                        ))}
                                </div>
                            </div>
                        )}
                        {/* End: Destination Scene section */}
                    </section>
                    {/* End: Footer section */}

                    {/* Start: Footer section */}
                    <section className='relative flex flex-col gap-y-4 px-6 py-4'>
                        <div className='absolute z-10 -top-4 left-0 right-0 h-4 bg-gradient-to-t from-white dark:from-black to-transparent border-b dark:border-gray-700'></div>
                        <div className='flex items-center justify-between'>
                            <button
                                type='button'
                                className='font-semibold text-sm hover:opacity-80'
                                onClick={handleCancelEditInfoHotspot}
                            >
                                Huỷ thao tác
                            </button>
                            <button
                                type='button'
                                className='font-semibold text-sm text-red-400 hover:opacity-80'
                                onClick={handleDeleteInfoHotspot}
                            >
                                Xoá điểm thông tin
                            </button>
                        </div>
                        <button
                            type='button'
                            className='flex items-center justify-center gap-1 px-4 py-2 font-semibold text-white bg-nature-green rounded drop-shadow hover:opacity-80'
                            onClick={handleSaveInfoHotspot}
                        >
                            <Unicons.UilCheck size='20' />
                            <span>Lưu điểm thông tin</span>
                        </button>
                    </section>
                    {/* End: Footer section */}
                </motion.section>
            )}
        </AnimatePresence>
    );
}
