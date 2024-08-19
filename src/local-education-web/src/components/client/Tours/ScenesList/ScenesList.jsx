/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';

/* Hooks */
import { useDebounce } from '@hooks/shared';

/* Redux */
import { disableScenesList, selectTour } from '@redux/features/client/tour';

/* Services */
import { getScenesByKeyword } from '@services/shared';

/* Components */
import { Input } from '@components/admin';
import { SceneItem } from '@components/shared';

export default function ScenesList() {
    /* States */
    const tourSlice = useSelector(selectTour);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [scenes, setScenes] = useState([]);
    const [isSearched, setIsSearched] = useState(false);

    /* Hooks */
    const { slug } = useParams();
    const dispatch = useDispatch();
    const debounceSearchKeyword = useDebounce(searchKeyword, 500);

    /* Refs */
    const searchKeywordRef = useRef(null);

    /* Functions */
    const clearSearchKeyword = () => {
        setSearchKeyword('');
    };
    const getScenes = async (keyword) => {
        const scenesResult = await getScenesByKeyword(keyword, slug);

        if (scenesResult.isSuccess) {
            setScenes(scenesResult.result);
            if (keyword.trim() === '') setIsSearched(false);
            else setIsSearched(true);
        } else {
            setScenes(scenes);
        }
    };

    /* Event handlers */
    const handleCloseScenesList = () => {
        dispatch(disableScenesList());
    };

    /* Side effects */
    /* Debounce search scenes input, get scenes result after 500ms */
    useEffect(() => {
        getScenes(searchKeyword);
    }, [debounceSearchKeyword]);

    return (
        <section
            className={`absolute top-0 right-full ${tourSlice.isShowControlBar ? 'bottom-12' : 'bottom-0'
                } flex flex-col w-96 max-w-[80vw] bg-white dark:bg-black border-r dark:border-gray-400 transition-transform duration-200 ${tourSlice.showScenesList ? 'translate-x-full' : 'translate-x-0'
                }`}
        >
            <section className='relative flex-grow flex flex-col gap-y-2 overflow-y-auto px-6 py-4'>
                <div className='flex items-center justify-between'>
                    <h1 className='mb-2 font-bold text-2xl min-h-[2rem] truncate'>Danh sách địa điểm</h1>
                    <button
                        type='button'
                        className='font-semibold text-sm text-blue-400'
                        onClick={handleCloseScenesList}
                    >
                        Đóng
                    </button>
                </div>
                <Input
                    ref={searchKeywordRef}
                    value={searchKeyword}
                    placeholder='Tìm kiếm địa điểm...'
                    rightIcon={<Unicons.UilSearch size='20' className='dark:text-white' />}
                    clearInput={clearSearchKeyword}
                    onChange={(e) => {
                        setSearchKeyword(e.target.value);
                    }}
                />
                <div className=' flex flex-col gap-y-2 overflow-y-auto no-scrollbar pb-4'>
                    {scenes.map((scene) => (
                        <SceneItem key={scene.id} scene={scene} isSearched={isSearched} />
                    ))}
                </div>
                <div className='absolute z-10 bottom-4 left-0 right-0 h-4 bg-gradient-to-t from-white dark:from-black to-transparent'></div>
            </section>
        </section>
    );
}
