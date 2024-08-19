/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Parser } from 'html-to-react';
import * as Unicons from '@iconscout/react-unicons';

/* Redux */
import { hideInfoHotspotDetailModal, selectTour } from '@redux/features/client/tour';

/* Utils */
import { extractFileName } from '@utils/strings';
import { getFileType } from '@utils/files';

/* Components */
import { Modal } from '@components/shared';

export default function InfoHotspotDetailModal() {
    /* Hooks */
    const dispatch = useDispatch();

    /* States */
    const tourSlice = useSelector(selectTour);
    const [slide, setSlide] = useState(null);
    const [index, setIndex] = useState(-1);

    /* Refs */
    const contentRef = useRef(null);

    /* Functions */
    const hasPreviousSlide = () => {
        if (!tourSlice.slides) return false;

        if (index > 0 && index <= tourSlice.slides.length - 1) return true;
        return false;
    };
    const hasNextSlide = () => {
        if (!tourSlice.slides) return false;

        if (index >= 0 && index < tourSlice.slides.length - 1) return true;
        return false;
    };

    /* Event handlers */
    const handleCloseInfoHotspotDetailModal = () => {
        dispatch(hideInfoHotspotDetailModal());
    };
    const handleGoBackSlide = () => {
        if (hasPreviousSlide()) setIndex((state) => --state);
    };
    const handleNextSlide = () => {
        if (hasNextSlide()) setIndex((state) => ++state);
    };

    /* Side effects */
    /* Reset index on slides changed */
    useEffect(() => {
        if (tourSlice.slides) setIndex(0);
        else setIndex(-1);
    }, [tourSlice.slides]);
    /* Get slide by index changed */
    useEffect(() => {
        if (index >= 0 && index < tourSlice.slides.length) {
            setSlide(tourSlice.slides[index]);
            if (contentRef.current) contentRef.current.scrollTo(0, 0);
        } else setSlide(null);
    }, [index]);

    return (
        <Modal show={tourSlice.isShowInfoHotspotDetailModal} handleClose={handleCloseInfoHotspotDetailModal}>
            {slide ? (
                <section className='grid grid-cols-3 overflow-y-auto xl:overflow-hidden w-[calc(100vw-3rem)] h-[calc(100dvh-3rem)] lg:h-[calc(100svh-9rem)] dark:text-white bg-white dark:bg-black rounded-lg shadow no-scrollbar'>
                    {/* Start: Close button */}
                    <button
                        type='button'
                        className='absolute z-10 top-4 right-6 px-4 py-2 font-semibold text-sm text-white bg-gray-500 rounded-full drop-shadow hover:opacity-80'
                        onClick={handleCloseInfoHotspotDetailModal}
                    >
                        Đóng
                    </button>
                    {/* End: Close button */}

                    {/* Start: Left section */}
                    <section
                        className={`relative ${slide.layout === 'full'
                                ? 'col-span-3 xl:col-span-2'
                                : slide.layout === 'media'
                                    ? 'col-span-3 h-full pb-14'
                                    : slide.layout === 'text'
                                        ? 'hidden'
                                        : ''
                            } bg-dark`}
                    >
                        {slide.urlPath ? (
                            getFileType(extractFileName(slide.urlPath).extension) === 'image' ? (
                                <div className='relative flex items-center justify-center w-full h-full'>
                                    <img
                                        src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`}
                                        alt={slide.title}
                                        className='xl:absolute max-w-full max-h-full object-contain'
                                    />
                                </div>
                            ) : getFileType(extractFileName(slide.urlPath).extension) === 'video' ? (
                                <video controls className='w-full h-full'>
                                    <source
                                        src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`}
                                        type='video/mp4'
                                    />
                                </video>
                            ) : getFileType(extractFileName(slide.urlPath).extension) === 'audio' ? (
                                <audio controls className='xl:absolute xl:bottom-0 my-4 px-6 w-full'>
                                    <source
                                        src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`}
                                        type='audio/mp3'
                                    />
                                </audio>
                            ) : null
                        ) : null}
                    </section>
                    {/* End: Left section */}

                    {/* Start: Right section */}
                    <section
                        ref={contentRef}
                        className={`${slide.layout === 'full'
                                ? 'col-span-3 xl:col-span-1'
                                : slide.layout === 'media'
                                    ? 'hidden'
                                    : slide.layout === 'text'
                                        ? 'col-span-3'
                                        : ''
                            } xl:overflow-y-auto ${hasPreviousSlide() || hasNextSlide() ? 'mb-14' : ''} p-6 xl:pt-16`}
                    >
                        <div className='relative z-0 my-4 xl:mt-0'>
                            <div className='absolute z-10 -top-3 -left-3 flex items-center justify-center h-10 aspect-square font-bold text-2xl text-white bg-gradient-to-br from-white via-blue-300 to-blue-300 rounded-full'>
                                {slide.index}
                            </div>
                            <h1 className='pl-10 pr-8 py-2 font-bold text-2xl border border-gray-200 rounded-2xl drop-shadow-md shadow-inner'>
                                {slide.title}
                            </h1>
                        </div>
                        <div className='max-w-full dark:text-white prose dark:prose-heading:text-white dark:prose-lead:text-white dark:prose-h1:text-white dark:prose-h2:text-white dark:prose-h3:text-white dark:prose-h4:text-white dark:prose-p:text-white dark:prose-a:text-white dark:prose-blockquote:text-white dark:prose-figure:text-white dark:prose-figcaption:text-white dark:prose-strong:text-white dark:prose-em:text-white dark:prose-code:text-white dark:prose-pre:text-white dark:prose-ol:text-white dark:prose-ul:text-white dark:prose-li:text-white dark:prose-table:text-white dark:prose-thead:text-white dark:prose-tr:text-white dark:prose-th:text-white dark:prose-td:text-white'>
                            {Parser().parse(
                                slide.content
                                    ?.toString()
                                    .replaceAll('https://localhost:7272', import.meta.env.VITE_API_ENDPOINT)
                            )}
                        </div>
                    </section>

                    {/* Start: Pagination section */}
                    {hasPreviousSlide() || hasNextSlide() ? (
                        <div
                            className={`absolute -bottom-px xl:bottom-0 left-0 xl:left-2/3 right-0 flex items-center justify-between px-6 py-4 ${slide.layout === 'media' ? 'text-white bg-dark dark:bg-dark' : 'bg-white dark:bg-black'
                                } rounded-b-lg xl:rounded-br-lg`}
                        >
                            <button
                                type='button'
                                disabled={!hasPreviousSlide()}
                                className={`flex items-center gap-x-1 font-bold ${!hasPreviousSlide() ? 'opacity-40' : 'hover:opacity-80 cursor-pointer'
                                    }`}
                                onClick={handleGoBackSlide}
                            >
                                <Unicons.UilArrowLeft size='24' />
                                <span>Bài trước</span>
                            </button>
                            <div>
                                Bài {index + 1}/{tourSlice.slides.length}
                            </div>
                            <button
                                type='button'
                                disabled={!hasNextSlide()}
                                className={`flex items-center gap-x-1 font-bold ${!hasNextSlide() ? 'opacity-40' : 'hover:opacity-80 cursor-pointer'
                                    }`}
                                onClick={handleNextSlide}
                            >
                                <span>Bài sau</span>
                                <Unicons.UilArrowRight size='24' />
                            </button>
                        </div>
                    ) : (
                        slide.layout === 'full' && (
                            <div className='absolute z-10 left-0 xl:left-2/3 right-0 bottom-0 h-6 bg-gradient-to-t from-white dark:from-black to-transparent border-b border-white dark:border-gray-700 rounded-b-lg'></div>
                        )
                    )}
                    {/* End: Pagination section */}
                    {/* End: Right section */}
                </section>
            ) : null}
        </Modal>
    );
}
