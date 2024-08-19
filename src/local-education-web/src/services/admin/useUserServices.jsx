/* Hooks */
import { useAxiosPrivate } from '@hooks/shared';

export default function useUserServices() {
    /* Hooks */
    const axiosPrivate = useAxiosPrivate();

    const getUsersByQueries = async (queries) => {
        const { data } = await axiosPrivate.get(`/api/users/getUsers?${queries}`);

        return data || null;
    };

    const getRoles = async () => {
        const { data } = await axiosPrivate.get(`/api/users/roles`);

        return data || null;
    };

    const updateUserRoles = async (userId, roleIdList) => {
        const { data } = await axiosPrivate.put(`/api/users/updateUserRoles`, { userId, roleIdList });

        return data || null;
    };

    return { getUsersByQueries, getRoles, updateUserRoles };
}
