/* Hooks */
import { useAxiosPrivate } from '@hooks/shared';

export default function useFileServices() {
    const axiosPrivate = useAxiosPrivate();

    const getFolders = async () => {
        const { data } = await axiosPrivate.get('/api/folders');

        return data || null;
    };

    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await axiosPrivate.post('/api/files/upload', formData);

        return data || null;
    };

    const getFilesByQueries = async (queries) => {
        const { data } = await axiosPrivate.get(`/api/files?${queries}`);

        return data || null;
    };

    const renameFile = async (file) => {
        const { data } = await axiosPrivate.put(`/api/files/rename/${file.id}`, file);

        return data || null;
    };

    const toggleFilesDeletedStatus = async (fileIds) => {
        const { data } = await axiosPrivate.delete(`/api/files/toggleDeleteFiles`, { data: fileIds });

        return data || null;
    };

    const deleteFiles = async (fileIds) => {
        const { data } = await axiosPrivate.delete(`/api/files/deleteFiles`, { data: fileIds });

        return data || null;
    };

    const emptyTrash = async () => {
        const { data } = await axiosPrivate.delete('/api/files/emptyRecycleBin');

        return data || null;
    };

    return { getFolders, uploadFile, getFilesByQueries, renameFile, toggleFilesDeletedStatus, deleteFiles, emptyTrash };
}
