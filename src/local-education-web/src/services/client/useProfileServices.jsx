/* Hooks */
import { useAxiosPrivate } from '@hooks/shared';

export default function useProfileServices() {
    /* Hooks */
    const axiosPrivate = useAxiosPrivate();

    const getProfile = async () => {
        const { data } = await axiosPrivate.get('/api/users/getProfile');

        return data || null;
    };
    const updateProfile = async (profile) => {
        const { data } = await axiosPrivate.put('/api/users/updateProfile', profile);

        return data || null;
    };
    const changePassword = async (password) => {
        const { data } = await axiosPrivate.put('/api/users/changePassword', password);

        return data || null;
    };

    return { getProfile, updateProfile, changePassword };
}
