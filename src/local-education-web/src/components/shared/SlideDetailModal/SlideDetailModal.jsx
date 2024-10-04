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
                <section className='no-scrollbar grid h-[calc(100dvh-3rem)] w-[calc(100vw-3rem)] grid-cols-3 overflow-y-auto rounded-lg bg-white shadow dark:bg-black dark:text-white lg:h-[calc(100svh-9rem)] xl:overflow-hidden'>
                    {/* Start: Close button */}
                    <button
                        type='button'
                        className='absolute right-6 top-4 z-10 rounded-full bg-gray-500 px-4 py-2 text-sm font-semibold text-white drop-shadow hover:opacity-80'
                        onClick={handleCloseInfoHotspotDetailModal}
                    >
                        Đóng
                    </button>
                    {/* End: Close button */}

                    {/* Start: Left section */}
                    <section
                        className={`relative ${
                            slide.layout === 'full'
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
                                <div className='relative flex h-full w-full items-center justify-center'>
                                    <img
                                        src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`}
                                        alt={slide.title}
                                        className='max-h-full max-w-full object-contain xl:absolute'
                                    />
                                </div>
                            ) : getFileType(extractFileName(slide.urlPath).extension) === 'video' ? (
                                <video controls className='h-full w-full'>
                                    <source
                                        src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`}
                                        type='video/mp4'
                                    />
                                </video>
                            ) : getFileType(extractFileName(slide.urlPath).extension) === 'audio' ? (
                                <audio controls className='my-4 w-full px-6 xl:absolute xl:bottom-0'>
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
                        className={`${
                            slide.layout === 'full'
                                ? 'col-span-3 xl:col-span-1'
                                : slide.layout === 'media'
                                ? 'hidden'
                                : slide.layout === 'text'
                                ? 'col-span-3'
                                : ''
                        } xl:overflow-y-auto ${hasPreviousSlide() || hasNextSlide() ? 'mb-14' : ''} p-6 xl:pt-16`}
                    >
                        <div className='relative z-0 my-4 xl:mt-0'>
                            <div className='absolute -left-3 -top-3 z-10 flex aspect-square h-10 items-center justify-center rounded-full bg-gradient-to-br from-white via-blue-300 to-blue-300 text-2xl font-bold text-white'>
                                {slide.index}
                            </div>
                            <h1 className='rounded-2xl border border-gray-200 py-2 pl-10 pr-8 text-2xl font-bold shadow-inner drop-shadow-md'>
                                {slide.title}
                            </h1>
                        </div>
                        <div className='dark:prose-heading:text-white prose max-w-full dark:text-white dark:prose-h1:text-white dark:prose-h2:text-white dark:prose-h3:text-white dark:prose-h4:text-white dark:prose-p:text-white dark:prose-a:text-white dark:prose-blockquote:text-white dark:prose-figure:text-white dark:prose-figcaption:text-white dark:prose-strong:text-white dark:prose-em:text-white dark:prose-code:text-white dark:prose-pre:text-white dark:prose-ol:text-white dark:prose-ul:text-white dark:prose-li:text-white dark:prose-table:text-white dark:prose-thead:text-white dark:prose-tr:text-white dark:prose-th:text-white dark:prose-td:text-white dark:prose-lead:text-white'>
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
                            className={`absolute -bottom-px left-0 right-0 flex items-center justify-between px-6 py-4 xl:bottom-0 xl:left-2/3 ${
                                slide.layout === 'media' ? 'bg-dark text-white dark:bg-dark' : 'bg-white dark:bg-black'
                            } rounded-b-lg xl:rounded-br-lg`}
                        >
                            <button
                                type='button'
                                disabled={!hasPreviousSlide()}
                                className={`flex items-center gap-x-1 font-bold ${
                                    !hasPreviousSlide() ? 'opacity-40' : 'cursor-pointer hover:opacity-80'
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
                                className={`flex items-center gap-x-1 font-bold ${
                                    !hasNextSlide() ? 'opacity-40' : 'cursor-pointer hover:opacity-80'
                                }`}
                                onClick={handleNextSlide}
                            >
                                <span>Bài sau</span>
                                <Unicons.UilArrowRight size='24' />
                            </button>
                        </div>
                    ) : (
                        slide.layout === 'full' && (
                            <div className='absolute bottom-0 left-0 right-0 z-10 h-6 rounded-b-lg border-b border-white bg-gradient-to-t from-white to-transparent dark:border-gray-700 dark:from-black xl:left-2/3'></div>
                        )
                    )}
                    {/* End: Pagination section */}
                    {/* End: Right section */}
                </section>
            ) : null}
        </Modal>
    );
}
