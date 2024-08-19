/* Libraries */
import { useEffect } from 'react';

/* Utils */
import { getSubPageTitle } from '@utils/metadata';

/* Components */
import { AboutSection, HeroSection, HomeCoursesSection } from '@components/client';
import { GoToTop, PageTransition } from '@components/shared';

export default function Home() {
    /* Functions */
    const setPageTitle = () => {
        document.title = getSubPageTitle('Trang chủ');
    };

    /* Side effects */
    /* Init component side effects */
    useEffect(() => {
        setPageTitle();
    }, []);

    return (
        <PageTransition className='overflow-x-hidden dark:bg-black dark:text-white'>
            <HeroSection />
            <AboutSection />
            <HomeCoursesSection />
            <GoToTop />
        </PageTransition>
    );
}
