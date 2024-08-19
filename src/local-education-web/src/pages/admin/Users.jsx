/* Libraries */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';

/* Redux */
import {
    decreaseUserPageNumber,
    increaseUserPageNumber,
    selectUserManagement,
    setUserPageNumber,
    setUserPageSize
} from '@redux/features/admin/userManagement';

/* Services */
import { useUserServices } from '@services/admin';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { AdminUsersControlSection, UserItem } from '@components/admin';
import { Container, Pager } from '@components/shared';

export default function Users() {
    /* Hooks */
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    /* Services */
    const userServices = useUserServices();

    /* States */
    const userManagement = useSelector(selectUserManagement);
    const [users, setUsers] = useState([]);
    const [metadata, setMetadata] = useState({});
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    /* Functions */
    const getUsers = async () => {
        setIsLoading(true);
        const usersResult = await userServices.getUsersByQueries(searchParams.toString());

        if (usersResult.isSuccess) {
            setUsers(usersResult.result.items);
            setMetadata(usersResult.result.metadata);
        } else {
            setUsers([]);
            setMetadata({});
        }
        setIsLoading(false);
    };
    const getRoles = async () => {
        const rolesResult = await userServices.getRoles();

        if (rolesResult.isSuccess) setRoles(rolesResult.result);
        else setRoles([]);
    };
    const setUserQueriesFromSearchParams = () => {
        const urlPageNumber = searchParams.get('PageNumber');
        const urlPageSize = searchParams.get('PageSize');

        if (urlPageNumber) dispatch(setUserPageNumber(urlPageNumber));
        if (urlPageSize) dispatch(setUserPageSize(urlPageSize));

        getRoles();
    };
    const setPageTitle = () => {
        document.title = getSubPageTitle('Quản lý tài khoản');
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        setUserQueriesFromSearchParams();
        setPageTitle();
    }, []);
    /* Sync users queries with URL search queries */
    useEffect(() => {
        setSearchParams(userManagement.usersQueries, { replace: true });
    }, [userManagement.usersQueries]);
    /* Get users by queries */
    useEffect(() => {
        getUsers();
    }, [searchParams, userManagement.isUpdateUsers]);

    return (
        <section className='min-h-[calc(100svh-3.75rem)] dark:bg-black dark:text-white'>
            <Container className='flex flex-col gap-4 py-4'>
                <h1 className='font-semibold text-2xl'>Danh sách tài khoản</h1>
                <AdminUsersControlSection />

                {/* Start: Users section */}
                {isLoading ? (
                    <Unicons.UilSpinner
                        size='48'
                        className='animate-spin animate-infinite animate-duration-1000 mx-auto dark:text-white'
                    />
                ) : (
                    <section className='overflow-x-auto border border-gray-400 dark:border-gray-800 rounded-lg'>
                        <div className='min-w-[76.875rem]'>
                            <div className='grid grid-cols-12 px-2 py-1 font-semibold text-white text-center bg-gray-400 dark:bg-dark'>
                                <div className='col-span-3'>Tài khoản</div>
                                <div className='col-span-3'>Email</div>
                                <div className='col-span-3'>Tên</div>
                                <div className='col-span-1'>Ngày tạo</div>
                                <div className='col-span-2'>Phân quyền</div>
                            </div>
                            {users.map((user) => (
                                <UserItem key={user.id} user={user} roles={roles} />
                            ))}
                        </div>
                    </section>
                )}
                {/* End: Users section */}

                <Pager
                    metadata={metadata}
                    increasePageNumber={() => {
                        dispatch(increaseUserPageNumber());
                    }}
                    decreasePageNumber={() => {
                        dispatch(decreaseUserPageNumber());
                    }}
                    setPageNumber={(pageNumber) => {
                        dispatch(setUserPageNumber(pageNumber));
                    }}
                    setPageSize={(pageSize) => {
                        dispatch(setUserPageSize(pageSize));
                    }}
                />
            </Container>
        </section>
    );
}
