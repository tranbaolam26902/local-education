/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as Unicons from '@iconscout/react-unicons';

/* Hooks */
import { useDebounce } from '@hooks/shared';

/* Redux */
import {
    decreaseClientTourPageNumber,
    increaseClientTourPageNumber,
    selectTour,
    setClientTourKeyword,
    setClientTourPageNumber
} from '@redux/features/client/tour';

/* Services */
import { getToursByQueries } from '@services/shared';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { Input } from '@components/admin';
import { CardBody, CardContainer, CardItem, Container, PageTransition, Pager } from '@components/shared';

function Tour({ tour }) {
    /* Hooks */
    const navigate = useNavigate();

    /* Functions */
    const handleNavigate = () => {
        navigate(`/tours/${tour.urlSlug}`);
    };

    return (
        <CardContainer containerClassName='h-full'>
            <CardBody className='bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] rounded-xl p-8 border h-full flex flex-col'>
                <CardItem
                    as={Link}
                    to={`/tours/${tour.urlSlug}`}
                    translateZ='50'
                    className='flex-1 text-lg font-bold text-neutral-600 dark:text-white line-clamp-2 hover:opacity-70'
                >
                    {tour.title}
                </CardItem>
                <CardItem
                    as='img'
                    translateZ={100}
                    src={`${import.meta.env.VITE_API_ENDPOINT}/${tour.urlPreview}`}
                    className='mt-4 w-full aspect-video object-cover rounded-xl group-hover/card:shadow-xl cursor-pointer'
                    alt={tour.title}
                    onClick={handleNavigate}
                ></CardItem>
                <div className='flex justify-between items-center mt-4'>
                    <CardItem translateZ={50} className='rounded-xl text-sm font-semibold uppercase dark:text-white'>
                        {tour.viewCount} lượt xem
                    </CardItem>
                    <CardItem
                        as={Link}
                        to={`/tours/${tour.urlSlug}`}
                        translateZ={50}
                        className='px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold hover:shadow-2xl hover:bg-opacity-70 dark:hover:bg-gray-200'
                    >
                        Xem chi tiết
                    </CardItem>
                </div>
            </CardBody>
        </CardContainer>
    );
}

export default function Tours() {
    /* States */
    const tourSlice = useSelector(selectTour);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [tours, setTours] = useState([]);
    const [metadata, setMetadata] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    /* Hooks */
    const dispatch = useDispatch();
    const debounceSearchKeyword = useDebounce(searchKeyword, 500);
    const [searchParams, setSearchParams] = useSearchParams();

    /* Refs */
    const searchKeywordRef = useRef(null);

    /* Functions */
    const clearSearchKeyword = () => {
        setSearchKeyword('');
    };
    const setPageTitle = () => {
        document.title = getSubPageTitle('Tour');
    };
    const getTours = async () => {
        setIsLoading(true);
        const toursResult = await getToursByQueries(searchParams.toString());

        if (toursResult.isSuccess) {
            setTours(toursResult.result.items);
            setMetadata(toursResult.result.metadata);
        } else {
            setTours([]);
            setMetadata({});
        }
        setIsLoading(false);
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        setPageTitle();
    }, []);
    /* Debounce search keyword */
    useEffect(() => {
        dispatch(setClientTourKeyword(searchKeyword.trim()));
    }, [debounceSearchKeyword]);
    /* Map tours queries to search params */
    useEffect(() => {
        setSearchParams(tourSlice.toursQueries, { replace: true });
    }, [tourSlice.toursQueries]);
    /* Get tours when search params changes */
    useEffect(() => {
        getTours();
    }, [searchParams]);

    return (
        <PageTransition className='min-h-[calc(100svh-3.75rem)] dark:text-white dark:bg-black'>
            <Container className='flex flex-col gap-y-8 md:gap-y-12 py-8 md:py-16'>
                <h1 className='font-bold text-2xl md:text-3xl lg:text-4xl text-center uppercase'>Danh sách Tour</h1>

                {/* Start: Search section */}
                <section className='mx-auto w-full md:w-4/5 lg:w-3/5 xl:w-1/2'>
                    <Input
                        ref={searchKeywordRef}
                        value={searchKeyword}
                        placeholder='Tìm kiếm tour...'
                        rightIcon={<Unicons.UilSearch size='20' className='dark:text-white' />}
                        clearInput={clearSearchKeyword}
                        onChange={(e) => {
                            setSearchKeyword(e.target.value);
                        }}
                    />
                </section>
                {/* End: Search section */}

                {isLoading ? (
                    <Unicons.UilSpinner
                        size='48'
                        className='animate-spin animate-infinite animate-duration-1000 mx-auto dark:text-white'
                    />
                ) : (
                    <section className='flex flex-col gap-y-6'>
                        {/* Start: Tours section */}
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8'>
                            {tours.map((tour) => (
                                <Tour key={tour.id} tour={tour} />
                            ))}
                        </div>
                        {/* End: Tours section */}

                        {/* Start: Pagination section */}
                        <Pager
                            hidePageSize
                            metadata={metadata}
                            increasePageNumber={() => {
                                dispatch(increaseClientTourPageNumber());
                            }}
                            decreasePageNumber={() => {
                                dispatch(decreaseClientTourPageNumber());
                            }}
                            setPageNumber={(pageNumber) => {
                                dispatch(setClientTourPageNumber(pageNumber));
                            }}
                        />
                        {/* End: Pagination section */}
                    </section>
                )}
            </Container>
        </PageTransition>
    );
}
