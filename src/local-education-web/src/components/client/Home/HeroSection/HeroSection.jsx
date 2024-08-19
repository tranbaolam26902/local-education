/* Libraries */
import { useEffect, useRef, useState } from 'react';
import { ImagePanorama, Viewer } from 'panolens';
import * as Unicons from '@iconscout/react-unicons';
import ScrollAnimation from 'react-animate-on-scroll';

/* Assets */
import { images } from '@assets/images';

/* Components */
import { ClientHomeHeader } from '@components/client';

export default function HeroSection() {
    /* States */
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    /* Refs */
    const containerRef = useRef(null);
    const viewerRef = useRef(null);
    const viewerElementRef = useRef(null);

    /* Event handlers */
    const handleExplore = () => {
        window.scrollTo(0, containerRef.current.clientHeight);
    };

    /* Side effects */
    /* Initialize Panorama Viewer */
    useEffect(() => {
        if (!isFirstLoad) return;
        setIsFirstLoad(false);

        viewerRef.current = new Viewer({
            container: viewerElementRef.current,
            cameraFov: 72,
            autoRotate: true,
            autoHideInfospot: false,
            autoRotateSpeed: 0.4,
            autoRotateActivationDuration: 1000,
            controlBar: false
        });
        const panorama = new ImagePanorama(images.homeScene);
        viewerRef.current.add(panorama);
    }, []);

    return (
        <section ref={containerRef} className='relative w-screen h-[100svh]'>
            <div id='panorama' ref={viewerElementRef} className='w-full h-full'></div>
            <div className='absolute inset-0 bg-black/40 snap-center'>
                <section className='flex flex-col items-center justify-between gap-y-4 mx-auto px-6 h-full'>
                    <ClientHomeHeader />
                    <div className='font-oswald flex flex-col gap-y-2 sm:gap-y-4 md:gap-y-6 lg:gap-y-8 w-full text-center'>
                        <h1 className='flex flex-col md:gap-y-6 lg:gap-y-8 font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide leading-tight text-white uppercase'>
                            <ScrollAnimation animateIn='fadeInUp' duration={0.8} offset={0} animateOnce>
                                <span>Hệ thống</span>
                            </ScrollAnimation>
                            <ScrollAnimation animateIn='fadeInUp' duration={0.8} delay={100} offset={0} animateOnce>
                                <span>Hỗ trợ Giáo dục địa phương</span>
                            </ScrollAnimation>
                            <ScrollAnimation animateIn='fadeInUp' duration={0.8} delay={200} offset={0} animateOnce>
                                <span>tỉnh Lâm Đồng</span>
                            </ScrollAnimation>
                        </h1>
                        <ScrollAnimation animateIn='fadeInUp' duration={0.8} delay={300} offset={0} animateOnce>
                            <h4 className='text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90'>
                                Dành cho học sinh Trung học Phổ thông
                            </h4>
                        </ScrollAnimation>
                    </div>
                    <ScrollAnimation animateIn='fadeInUp' duration={0.8} delay={300} offset={0} animateOnce>
                        <button
                            type='button'
                            className='flex flex-col items-center font-semibold md:text-lg text-white uppercase animate-float'
                            onClick={handleExplore}
                        >
                            <span>Khám phá</span>
                            <Unicons.UilAngleDown size='48' />
                        </button>
                    </ScrollAnimation>
                </section>
            </div>
        </section>
    );
}
