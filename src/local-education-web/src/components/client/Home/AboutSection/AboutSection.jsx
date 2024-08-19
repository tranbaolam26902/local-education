/* Libraries */
import { useRef } from 'react';
import * as Unicons from '@iconscout/react-unicons';
import ScrollAnimation from 'react-animate-on-scroll';

/* Assets */
import { images } from '@assets/images';

export default function AboutSection() {
    /* Refs */
    const containerRef = useRef(null);

    /* Event handlers */
    const handleNextSection = () => {
        window.scrollTo(0, containerRef.current.clientHeight + containerRef.current.offsetTop);
    };

    return (
        <section ref={containerRef} id='about' className='mx-auto px-6 min-h-[100svh]'>
            <div className='flex flex-col justify-center gap-y-8 md:gap-y-8 py-8 md:py-16 w-full min-h-[100svh]'>
                <ScrollAnimation animateIn='fadeInUp' duration={0.8} offset={0} animateOnce>
                    <h1 className='font-bold text-2xl md:text-3xl text-center uppercase'>Giới thiệu</h1>
                </ScrollAnimation>
                <ScrollAnimation animateIn='fadeInUp' duration={0.8} delay={50} offset={0} animateOnce>
                    <img src={images.homeAbout} alt='about' className='mx-auto w-4/5 md:w-3/5 lg:w-1/2 xl:w-2/5' />
                </ScrollAnimation>
                <ScrollAnimation animateIn='fadeInUp' duration={0.8} delay={100} offset={0} animateOnce>
                    <p className='mx-auto lg:w-4/5 xl:w-3/5 text-center italic tracking-wider'>
                        "Hệ thống hỗ trợ giáo dục địa phương tỉnh Lâm Đồng không chỉ cung cấp kiến thức mà còn mở ra
                        cánh cửa của trí tưởng tượng và sự tò mò thông qua công nghệ thực tế ảo. Bằng cách chuyển hóa
                        hình ảnh panorama 360 độ thành các tour du lịch ảo, từng địa điểm không chỉ là điểm đến mà còn
                        là một bài học sống động về văn hóa, lịch sử và bản sắc địa phương. Bắt đầu hành trình khám phá
                        giáo dục địa phương tỉnh Lâm Đồng ngay hôm nay để mở ra những trải nghiệm học tập đầy thú vị."
                    </p>
                </ScrollAnimation>
                <ScrollAnimation animateIn='fadeInUp' duration={0.8} delay={200} offset={0} animateOnce>
                    <button
                        type='button'
                        className='flex flex-col items-center mx-auto mt-4 w-fit font-semibold md:text-lg dark:text-white uppercase animate-float'
                        onClick={handleNextSection}
                    >
                        <span>Tiếp tục</span>
                        <Unicons.UilAngleDown size='48' />
                    </button>
                </ScrollAnimation>
            </div>
        </section>
    );
}
