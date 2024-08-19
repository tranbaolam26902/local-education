/* Libraries */
import { useEffect, useRef } from 'react';
import * as Unicons from '@iconscout/react-unicons';

export default function Pager({
    metadata,
    increasePageNumber,
    decreasePageNumber,
    setPageNumber,
    setPageSize,
    hidePageSize
}) {
    /* Refs */
    const pageNumberRef = useRef(null);
    const pageSizeRef = useRef(null);

    /* Event handlers */
    const handleIncreasePageNumber = () => {
        if (metadata.hasNextPage) increasePageNumber();
    };
    const handleDecreasePageNumber = () => {
        if (metadata.hasPreviousPage) decreasePageNumber();
    };
    const handleChangePageNumber = (e) => {
        e.preventDefault();

        const pageNumber = pageNumberRef.current.value;

        if (pageNumber === metadata.pageNumber) return;
        if (pageNumber > metadata.pageCount) {
            setPageNumber(metadata.pageCount);
            pageNumberRef.current.value = metadata.pageCount;
        }
        if (pageNumber < 1) {
            setPageNumber(1);
            pageNumberRef.current.value = 1;
        }
        if (pageNumber >= 1 && pageNumber <= metadata.pageCount) setPageNumber(pageNumber);
    };
    const handleChangePageSize = (e) => {
        setPageSize(e.target.value);
    };

    /* Side effects */
    /* Auto navigate to last page if changing page size affects page count */
    useEffect(() => {
        if (metadata.pageNumber > metadata.pageCount && metadata.pageCount) setPageNumber(metadata.pageCount);
    }, [metadata.pageSize, metadata.pageCount]);
    useEffect(() => {
        if (metadata.pageNumber !== undefined && metadata.pageNumber !== pageNumberRef.current.value)
            pageNumberRef.current.value = metadata.pageNumber;
    }, [metadata.pageNumber]);

    return (
        <section className='flex items-center justify-between flex-wrap gap-y-2'>
            <div
                className={`flex-1 md:flex-auto flex ${hidePageSize ? 'flex-col md:flex-row' : ''
                    } items-center justify-between md:justify-start gap-4`}
            >
                <div className='flex items-center gap-2'>
                    <button type='button' disabled={!metadata.hasPreviousPage} onClick={handleDecreasePageNumber}>
                        <Unicons.UilArrowLeft size='28' />
                    </button>
                    <span>{metadata.pageCount !== 0 ? metadata.pageNumber : 0}</span>
                    <span>/</span>
                    <span>{metadata.pageCount}</span>
                    <button type='button' disabled={!metadata.hasNextPage} onClick={handleIncreasePageNumber}>
                        <Unicons.UilArrowRight size='28' />
                    </button>
                </div>
                <form onSubmit={handleChangePageNumber} className='flex items-center gap-2'>
                    <span>Trang:</span>
                    <input
                        ref={pageNumberRef}
                        type='number'
                        className='w-12 px-2 text-center bg-white dark:bg-dark border border-gray-400 rounded'
                        onClick={(e) => {
                            e.target.select();
                        }}
                    />
                    <button type='submit' className='font-bold text-sm'>
                        Đến
                    </button>
                </form>
            </div>
            {!hidePageSize && (
                <div className='flex-1 md:flex-auto flex items-center justify-between md:justify-end gap-4'>
                    <div className='flex items-center gap-2 ml-1'>
                        <span>Số lượng:</span>
                        <select
                            ref={pageSizeRef}
                            value={metadata.pageSize}
                            className='px-2 bg-white dark:bg-dark border border-gray-400 rounded'
                            onChange={handleChangePageSize}
                        >
                            {[...Array(51).keys()].map((number) => {
                                if (number && number % 10 === 0)
                                    return (
                                        <option key={number} value={number}>
                                            {number}
                                        </option>
                                    );
                            })}
                        </select>
                    </div>
                    <div className='flex items-center gap-1'>
                        <span>Kết quả:</span>
                        <span className='font-bold'>{metadata.totalItemCount !== 0 ? metadata.firstItemIndex : 0}</span>
                        <span>-</span>
                        <span className='font-bold'>{metadata.lastItemIndex}</span>
                        <span>/</span>
                        <span className='font-bold'>{metadata.totalItemCount}</span>
                    </div>
                </div>
            )}
        </section>
    );
}
