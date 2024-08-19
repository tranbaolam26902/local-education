/* Libraries */
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/* Pages */
import {
    AddUser,
    Courses,
    Dashboard,
    EditCourse,
    EditLesson,
    EditSlide,
    EditTour,
    Lessons,
    Slides,
    Tours,
    Users
} from '@pages/admin';
import { ClientCourses, ClientTours, CourseDetail, Finished, Home, Learning, Tour } from '@pages/client';
import { Forbidden, Login, NotFound, Profile, SignUp } from '@pages/shared';

/* Components */
import { AdminLayout, RequireAdmin } from '@components/admin';
import { ClientLayout } from '@components/client';
import { LoadSettings, PersistLogin, RequireLogin } from '@components/shared';

/* Redux */
import { store } from '@redux/store';
import { setEditingTour, setIsShowOnStartUp, setMapPath, setPins } from '@redux/features/admin/editTour';

/* Services */
import { getCourseBySlug, getLessonById, getLessonsByCourseSlug, getTourBySlug } from '@services/shared';

/* Event handlers */
/* Start: Client event handlers */
const handleLoadCourseDetailPage = async ({ params }) => {
    const loaderData = {};

    const course = await getCourseBySlug(params.slug);

    if (!course.isSuccess) throw new Response('Not Found', { status: course.statusCode });
    else loaderData.course = course.result;

    const lessons = await getLessonsByCourseSlug(params.slug);
    if (lessons.isSuccess) loaderData.lessons = lessons.result;

    return loaderData;
};
const handleLoadLearningPage = async ({ params }) => {
    const loaderData = {};

    const course = await getCourseBySlug(params.slug);

    if (!course.isSuccess) throw new Response('Not Found', { status: course.statusCode });
    else loaderData.course = course.result;

    const lessons = await getLessonsByCourseSlug(params.slug);
    if (lessons.isSuccess) loaderData.lessons = lessons.result;

    return loaderData;
};
const handleLoadTourPage = async ({ params }) => {
    const tour = await getTourBySlug(params.slug);

    if (!tour.isSuccess) throw new Response('Not Found', { status: tour.statusCode });

    return { tour: tour.result };
};
/* End: Client event handlers */

/* Start: Admin event handlers */
const handleLoadEditTourPage = async ({ params }) => {
    const tour = await getTourBySlug(params.slug);

    if (!tour.isSuccess) throw new Response('Not Found', { status: tour.statusCode });

    store.dispatch(setEditingTour(tour.result));
    if (tour.result.atlas) {
        store.dispatch(setMapPath(tour.result.atlas.path));
        if (tour.result.atlas.pins.length) {
            const pins = tour.result.atlas.pins.map((pin) => ({ ...pin, name: `pin-${pin.top}-${pin.left}` }));
            store.dispatch(setPins(pins));
        } else store.dispatch(setPins([]));
        store.dispatch(setIsShowOnStartUp(tour.result.atlas.isShowOnStartUp));
    } else {
        store.dispatch(setMapPath(''));
        store.dispatch(setPins([]));
    }

    return tour.result;
};
const handleLoadEditCoursePage = async ({ params }) => {
    const course = await getCourseBySlug(params.slug);

    if (!course.isSuccess) throw new Response('Not Found', { state: course.statusCode });

    return { course: course.result };
};
const handleLoadEditLessonPage = async ({ params }) => {
    const lesson = await getLessonById(params.id);

    if (!lesson.isSuccess) throw new Response('Not Found', { state: lesson.statusCode });

    return { lesson: lesson.result };
};
/* End: Admin event handlers */

/* Config routes */
const router = createBrowserRouter([
    {
        path: '/',
        element: <LoadSettings />,
        children: [
            {
                path: '/',
                element: <PersistLogin />,
                children: [
                    /* Other layouts */
                    {
                        path: '/',
                        element: <Home />
                    },
                    {
                        path: '/learning/:slug',
                        element: <Learning />,
                        loader: handleLoadLearningPage,
                        errorElement: <NotFound />
                    },
                    /* Default layout */
                    {
                        path: '/',
                        element: <ClientLayout />,
                        /* Client routes */
                        children: [
                            /* Public routes */
                            {
                                path: '/account/login',
                                element: <Login />
                            },
                            {
                                path: '/account/sign-up',
                                element: <SignUp />
                            },
                            {
                                path: '/courses',
                                element: <ClientCourses />
                            },
                            {
                                path: '/courses/:slug',
                                element: <CourseDetail />,
                                loader: handleLoadCourseDetailPage,
                                errorElement: <NotFound />
                            },
                            {
                                path: '/tours',
                                element: <ClientTours />
                            },
                            {
                                path: '/tours/:slug',
                                element: <Tour />,
                                loader: handleLoadTourPage,
                                errorElement: <NotFound />
                            },
                            {
                                path: '/learning/finished',
                                element: <Finished />
                            },
                            /* Required login routes */
                            {
                                path: '/',
                                element: <RequireLogin />,
                                children: [
                                    {
                                        path: '/account/profile',
                                        element: <Profile />
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        path: '/admin',
                        element: <RequireAdmin />,
                        errorElement: <Forbidden />,
                        /* Admin routes */
                        children: [
                            {
                                path: '/admin',
                                element: <AdminLayout />,
                                children: [
                                    {
                                        path: '/admin/',
                                        element: <Dashboard />
                                    },
                                    {
                                        path: '/admin/dashboard',
                                        element: <Dashboard />
                                    },
                                    {
                                        path: '/admin/users',
                                        element: <Users />
                                    },
                                    {
                                        path: '/admin/users/create',
                                        element: <AddUser />
                                    },
                                    {
                                        path: '/admin/tours/:slug',
                                        element: <EditTour />,
                                        loader: handleLoadEditTourPage,
                                        errorElement: <NotFound />
                                    },
                                    {
                                        path: '/admin/tours',
                                        element: <Tours />
                                    },
                                    {
                                        path: '/admin/courses',
                                        element: <Courses />
                                    },
                                    {
                                        path: '/admin/courses/create',
                                        element: <EditCourse />
                                    },
                                    {
                                        path: '/admin/courses/edit/:slug',
                                        element: <EditCourse />,
                                        loader: handleLoadEditCoursePage,
                                        errorElement: <NotFound />
                                    },
                                    {
                                        path: '/admin/lessons',
                                        element: <Lessons />
                                    },
                                    {
                                        path: '/admin/lessons/create',
                                        element: <EditLesson />
                                    },
                                    {
                                        path: '/admin/lessons/edit/:id',
                                        element: <EditLesson />,
                                        loader: handleLoadEditLessonPage,
                                        errorElement: <NotFound />
                                    },
                                    {
                                        path: '/admin/slides',
                                        element: <Slides />
                                    },
                                    {
                                        path: '/admin/slides/create',
                                        element: <EditSlide />
                                    },
                                    {
                                        path: '/admin/slides/edit/:id',
                                        element: <EditSlide />,
                                        errorElement: <NotFound />
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        path: '*',
                        element: <NotFound />
                    }
                ]
            }
        ]
    }
]);

export default function App() {
    return <RouterProvider router={router} />;
}
