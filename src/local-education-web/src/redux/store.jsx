/* Libraries */
import { configureStore } from '@reduxjs/toolkit';

/* Reducers */
import { courseManagementReducer } from '@redux/features/admin/courseManagement';
import {
    editMapReducer,
    editTourReducer,
    infoHotspotReducer,
    linkHotspotReducer,
    paneManagementReducer
} from '@redux/features/admin/editTour';
import { fileManagementReducer } from '@redux/features/admin/fileManagement';
import { lessonManagementReducer } from '@redux/features/admin/lessonManagement/lessonManagementSlice';
import { slideManagementReducer } from '@redux/features/admin/slideManagement';
import { tourManagementReducer } from '@redux/features/admin/tourManagement';
import { userManagementReducer } from '@redux/features/admin/userManagement';
import { courseReducer } from '@redux/features/client/course';
import { layoutReducer } from '@redux/features/client/layout';
import { learningReducer } from '@redux/features/client/learning';
import { profileReducer } from '@redux/features/client/profile';
import { tourReducer } from '@redux/features/client/tour';
import { authReducer } from '@redux/features/shared/auth';
import { settingsReducer } from '@redux/features/shared/settings';

export const store = configureStore({
    reducer: {
        courseManagement: courseManagementReducer,
        editMap: editMapReducer,
        editTour: editTourReducer,
        infoHotspot: infoHotspotReducer,
        linkHotspot: linkHotspotReducer,
        paneManagement: paneManagementReducer,
        fileManagement: fileManagementReducer,
        lessonManagement: lessonManagementReducer,
        slideManagement: slideManagementReducer,
        tourManagement: tourManagementReducer,
        userManagement: userManagementReducer,
        course: courseReducer,
        layout: layoutReducer,
        learning: learningReducer,
        profile: profileReducer,
        tour: tourReducer,
        auth: authReducer,
        settings: settingsReducer
    },
    devTools: false,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});
