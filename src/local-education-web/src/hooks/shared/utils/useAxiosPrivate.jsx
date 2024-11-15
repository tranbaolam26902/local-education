/* Libraries */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

/* Hooks */
import { useRefreshToken } from '@hooks/shared';

/* Redux */
import { selectAuth } from '@redux/features/shared/auth';

/* Services */
import { axiosPrivate } from '@services/shared';

export default function useAxiosPrivate() {
    /* States */
    const auth = useSelector(selectAuth);

    /* Hooks */
    const refresh = useRefreshToken();

    /* useEffects */
    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            (config) => {
                if (!config.headers.Authorization) config.headers.Authorization = `bearer ${auth.accessToken}`;
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            (response) => response,
            async (error) => {
                const previousRequest = error?.config;
                if ((error?.response?.status === 403 || error?.response?.status === 401) && !previousRequest?.sent) {
                    previousRequest.sent = true;
                    const newAccessToken = await refresh();
                    previousRequest.headers.Authorization = `bearer ${newAccessToken}`;
                    return axiosPrivate(previousRequest);
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        };
    }, [auth.accessToken, refresh]);

    return axiosPrivate;
}
