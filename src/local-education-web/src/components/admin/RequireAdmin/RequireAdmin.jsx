/* Libraries */
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/* Redux */
import { selectAuth } from '@redux/features/shared/auth';

export default function RequiredAdmin() {
    /* Hooks */
    const location = useLocation();

    /* States */
    const auth = useSelector(selectAuth);

    /* Functions */
    const isAdmin = () => {
        if (auth.userDto.roles.length < 3 || !auth.userDto.roles.find((role) => role.name === 'Admin'))
            throw new Response('Forbidden', { status: 403 });

        return true;
    };

    return !auth.accessToken || !isAdmin() ? (
        <Navigate to='/account/login' state={{ from: { pathname: location.pathname } }} />
    ) : (
        <Outlet />
    );
}
