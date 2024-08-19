/* Libraries */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';
import { useDispatch, useSelector } from 'react-redux';

/* Redux */
import {
    decreaseTourPageNumber,
    increaseTourPageNumber,
    selectTourManagement,
    setShowCreateTourModal,
    setTourPageNumber,
    setTourPageSize
} from '@redux/features/admin/tourManagement';
import { selectSettings } from '@redux/features/shared/settings';

/* Services */
import { useTourServices } from '@services/admin';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { AdminToursControlSection, TourTitleModal } from '@components/admin';
import { Container, Pager, TourGridItem, TourRowItem } from '@components/shared';

export default function Tours() {
    /* Services */
    const tourServices = useTourServices();

    /* States */
    const settings = useSelector(selectSettings);
    const tourManagement = useSelector(selectTourManagement);
    const [tours, setTours] = useState([]);
    const [toursMetadata, setToursMetadata] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    /* Hooks */
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams(tourManagement.toursQueries);

    /* Functions */
    const getTours = async () => {
        setIsLoading(true);
        const toursResult = await tourServices.getToursByQueries(searchParams.toString());

        if (toursResult.isSuccess) {
            setTours(toursResult.result.items);
            setToursMetadata(toursResult.result.metadata);
        } else {
            setTours([]);
            setToursMetadata({});
        }
        setIsLoading(false);
    };
    const setTourQueriesFromSearchParams = () => {
        const urlPageNumber = searchParams.get('PageNumber');
        const urlPageSize = searchParams.get('PageSize');

        if (urlPageNumber) dispatch(setTourPageNumber(urlPageNumber));
        if (urlPageSize) dispatch(setTourPageSize(urlPageSize));
    };
    const setPageTitle = () => {
        document.title = getSubPageTitle('Quản lý tours');
    };

    /* Event handlers */
    const handleShowCreateTourModal = () => {
        dispatch(setShowCreateTourModal(true));
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        setTourQueriesFromSearchParams();
        setPageTitle();
    }, []);
    /* Sync tour queries with URL search queries */
    useEffect(() => {
        setSearchParams(tourManagement.toursQueries, { replace: true });
    }, [tourManagement.toursQueries]);
    /* Get tours by queries */
    useEffect(() => {
        getTours();
    }, [searchParams, tourManagement.isUpdateTours]);

    return (
        <>
            <section className='min-h-[calc(100svh-3.75rem)] dark:bg-black dark:text-white'>
                <Container className='flex flex-col gap-4 py-4'>
                    <h1 className='font-semibold text-2xl'>Danh sách Tours</h1>

                    <AdminToursControlSection />

                    {settings.tourViewMode === 'grid' ? (
                        <>
                            {isLoading ? (
                                <Unicons.UilSpinner
                                    size='48'
                                    className='animate-spin animate-infinite animate-duration-1000 mx-auto dark:text-white'
                                />
                            ) : (
                                <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                                    {!tourManagement.toursQueries.IsDeleted && (
                                        <button
                                            type='button'
                                            className='flex flex-col items-center justify-center gap-2 w-full h-full aspect-[4/3] bg-white border-dashed border-2 border-gray-500 rounded-md shadow-lg transition-transform duration-200 hover:translate-x-0.5 hover:-translate-y-0.5 dark:bg-dark'
                                            onClick={handleShowCreateTourModal}
                                        >
                                            <span className='p-4 aspect-square text-white bg-nature-green rounded-full drop-shadow'>
                                                <Unicons.UilPlus size='24' className='text-white' />
                                            </span>
                                            <span className='font-semibold text-lg'>Tạo mới</span>
                                        </button>
                                    )}
                                    {tours.map((tour) => (
                                        <TourGridItem key={tour.id} tour={tour} />
                                    ))}
                                </section>
                            )}
                        </>
                    ) : (
                        <>
                            {isLoading ? (
                                <Unicons.UilSpinner
                                    size='48'
                                    className='animate-spin animate-infinite animate-duration-1000 mx-auto dark:text-white'
                                />
                            ) : (
                                <section className='flex flex-col gap-4'>
                                    {!tourManagement.toursQueries.IsDeleted && (
                                        <button
                                            type='button'
                                            className='flex items-center gap-1 px-4 py-2 w-fit text-white bg-nature-green rounded shadow-inner hover:opacity-80'
                                            onClick={handleShowCreateTourModal}
                                        >
                                            <Unicons.UilPlus size='20' className='text-white' />
                                            <span>Tạo mới</span>
                                        </button>
                                    )}
                                    <div className='flex flex-col overflow-x-auto'>
                                        {tours.map((tour) => (
                                            <TourRowItem key={tour.id} tour={tour} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}

                    <Pager
                        metadata={toursMetadata}
                        increasePageNumber={() => {
                            dispatch(increaseTourPageNumber());
                        }}
                        decreasePageNumber={() => {
                            dispatch(decreaseTourPageNumber());
                        }}
                        setPageNumber={(pageNumber) => {
                            dispatch(setTourPageNumber(pageNumber));
                        }}
                        setPageSize={(pageSize) => {
                            dispatch(setTourPageSize(pageSize));
                        }}
                    />
                </Container>
            </section>
            <TourTitleModal />
        </>
    );
}
