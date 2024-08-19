/* Hooks */
import { useAxiosPrivate } from '@hooks/shared';

export default function useSceneServices() {
    const axiosPrivate = useAxiosPrivate();

    const updateTourScenes = async (tourId, scenes) => {
        const { data } = await axiosPrivate.post(`/api/tours/scenesTour/${tourId}`, scenes);

        return data || null;
    };

    return { updateTourScenes };
}
