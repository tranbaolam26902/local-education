/* Libraries */
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

/* Redux */
import { triggerUpdateUsers } from '@redux/features/admin/userManagement';

/* Services */
import { useUserServices } from '@services/admin';

export default function UserItem({ user, roles }) {
    /* Hooks */
    const dispatch = useDispatch();

    /* Services */
    const userServices = useUserServices();

    /* States */
    const [roleIds, setRoleIds] = useState(user.roles.map((role) => role.id).toString());

    /* Functions */
    const getRoleIdsByName = (name) => {
        switch (name) {
            case 'Admin':
                return roles.map((role) => role.id).toString();
            case 'Manager':
                return roles
                    .filter((role) => role.name !== 'Admin')
                    .map((role) => role.id)
                    .toString();
            case 'User':
                return roles.find((role) => role.name === 'User').id;
        }
    };

    /* Event handlers */
    const handleChangeUserRole = async (e) => {
        setRoleIds(e.target.value);

        const updateResult = await userServices.updateUserRoles(user.id, e.target.value.split(','));

        if (updateResult.isSuccess) {
            toast.success('Cập nhật phân quyền thành công.');
            dispatch(triggerUpdateUsers());
        } else toast.error(`Cập nhật phân quyền thất bại. ${updateResult.errors[0]}`);
    };

    return (
        <div className='grid grid-cols-12 p-2 odd:bg-gray-100 dark:odd:bg-dark'>
            <div className='col-span-3 px-1'>{user.username}</div>
            <div className='col-span-3 px-1'>{user.email}</div>
            <div className='col-span-3 px-1'>{user.name}</div>
            <div className='col-span-1 px-1 text-center'>
                {new Date(user.createdDate).toLocaleString('vi-VN', { dateStyle: 'short' })}
            </div>
            <div className='col-span-2 pr-1 text-center'>
                <select
                    value={roleIds}
                    onChange={handleChangeUserRole}
                    className='px-2 py-1 bg-transparent dark:text-white border border-gray-400 rounded shadow-inner'
                >
                    {roles.map((role) => (
                        <option key={role.id} value={getRoleIdsByName(role.name)} className='dark:bg-dark'>
                            {role.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
