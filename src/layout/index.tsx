import React from 'react';

import Header from '@/components/header';
import AuraSidebar from '@/components/sidebar/AuraSidebar';
import UserSidebar from '@/components/sidebar/UserSidebar';
import NavigationBottom from '@/components/navigationBottom';
import { useMediaQuery } from 'react-responsive';
import { mainBackgroundColor, sideBarBackgroundColor } from '@/const/colors';

interface Props {
    children: React.ReactNode;
}

export default function Index({ children }: Props) {
    const isLarge = useMediaQuery({ query: '(min-width: 768px)' });
    const styles = {
        display: 'grid',
        gridTemplateColumns: isLarge ? '384px auto' : '1fr',
        marginTop: 8,
        height: isLarge ? 'calc(100vh - 82px)' : '100%',
        // gridTemplateRows: isLarge ? '1000px 1fr' : '1fr',
    };

    return (
        <>
            <Header />
            <section style={styles} className="md-lg:!grid-cols-1 grid-rows-1">
                <aside
                    className="md-lg:!hidden"
                    style={{
                        display: isLarge ? 'grid' : 'none',
                        backgroundColor: sideBarBackgroundColor,
                        borderRadius: 20,
                        gridRowStart: 1,
                        gridRowEnd: 2,
                        paddingTop: 20,
                        paddingLeft: 20,
                        // gridTemplateRows: 'max-content minmax(0, 1fr)',
                        paddingBottom: '36px',
                        // height: 500,
                    }}
                >
                    <AuraSidebar />
                    <UserSidebar />
                </aside>
                <main
                    className="overflow-y-scroll scrollbar-custom h-full"
                    style={{
                        marginLeft: 8,
                        padding: '24px',
                        overflow: 'hidden',
                        backgroundColor: mainBackgroundColor,
                        borderRadius: 20,
                        // Media query styles for small/medium devices
                        ...(window.innerWidth < 768 && {
                            paddingRight: '15px',
                            paddingLeft: '15px', // Adjust this for your breakpoint needs
                            paddingTop: '15px',
                            paddingBottom: '110px',
                            marginLeft: 0,
                        }),
                    }}
                >
                    {children}
                </main>
            </section>
            <NavigationBottom />
        </>
    );
}
