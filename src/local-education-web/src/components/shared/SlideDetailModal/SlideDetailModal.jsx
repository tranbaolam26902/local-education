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
    const containerRef = useRef(null);
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
        if (containerRef.current) {
            containerRef.current.scrollTo(0, 0);
        }
        if (hasPreviousSlide()) setIndex((state) => --state);
    };
    const handleNextSlide = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo(0, 0);
        }
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
                <div
                    ref={containerRef}
                    className='h-[calc(100dvh-3rem)] w-[calc(100vw-3rem)] overflow-y-auto rounded-lg bg-white shadow dark:bg-black dark:text-white lg:h-[calc(100svh-9rem)]'
                >
                    {/* Start: Close button */}
                    <button
                        type='button'
                        className='absolute right-6 top-4 z-10 rounded-full bg-gray-500 px-4 py-2 text-sm font-semibold text-white drop-shadow hover:opacity-80'
                        onClick={handleCloseInfoHotspotDetailModal}
                    >
                        Đóng
                    </button>
                    {/* End: Close button */}

                    {/* Start: Media section */}
                    <section className='flex items-center justify-center bg-dark'>
                        {slide.urlPath ? (
                            getFileType(extractFileName(slide.urlPath).extension) === 'image' ? (
                                <img
                                    src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`}
                                    alt={slide.title}
                                    className='max-h-full max-w-full object-contain'
                                />
                            ) : getFileType(extractFileName(slide.urlPath).extension) === 'video' ? (
                                <video controls className='max-h-full max-w-full px-[8%]'>
                                    <source
                                        src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`}
                                        type='video/mp4'
                                    />
                                </video>
                            ) : getFileType(extractFileName(slide.urlPath).extension) === 'audio' ? (
                                <audio controls className='m-6 w-full'>
                                    <source
                                        src={`${import.meta.env.VITE_API_ENDPOINT}/${slide.urlPath}`}
                                        type='audio/mp3'
                                    />
                                </audio>
                            ) : null
                        ) : null}
                    </section>
                    {/* End: Media section */}

                    {/* Start: Content section */}
                    <section className='mx-auto flex max-w-3xl flex-col gap-y-4 p-4'>
                        <h1 className='text-justify text-lg font-bold uppercase'>
                            Bài {slide.index}: {slide.title}
                        </h1>

                        <section ref={contentRef} className={`${slide.layout === 'media' ? 'hidden' : ''}`}>
                            <div className='dark:prose-heading:text-white prose max-w-full break-words dark:text-white dark:prose-h1:text-white dark:prose-h2:text-white dark:prose-h3:text-white dark:prose-h4:text-white dark:prose-p:text-white dark:prose-a:text-white dark:prose-blockquote:text-white dark:prose-figure:text-white dark:prose-figcaption:text-white dark:prose-strong:text-white dark:prose-em:text-white dark:prose-code:text-white dark:prose-pre:text-white dark:prose-ol:text-white dark:prose-ul:text-white dark:prose-li:text-white dark:prose-table:text-white dark:prose-thead:text-white dark:prose-tr:text-white dark:prose-th:text-white dark:prose-td:text-white dark:prose-lead:text-white'>
                                {Parser().parse(
                                    slide.content
                                        ?.toString()
                                        .replaceAll('https://localhost:7272', import.meta.env.VITE_API_ENDPOINT)
                                )}
                            </div>
                        </section>

                        {/* Start: Pagination section */}
                        {hasPreviousSlide() || hasNextSlide() ? (
                            <div className='flex items-center justify-between border-t bg-white px-6 py-4 dark:bg-black'>
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
                        ) : null}
                        {/* End: Pagination section */}
                    </section>
                    {/* End: Content section */}
                </div>
            ) : null}
        </Modal>
    );
}
