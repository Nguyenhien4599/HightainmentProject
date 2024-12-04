import React from 'react';
import '@aws-amplify/ui-react/styles.css';
import { AuthUser } from 'aws-amplify/auth';
import ReactGA from 'react-ga4';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { isMobile } from 'react-device-detect';

import { mainBackgroundColor, primaryTextColor, secondaryTextColor } from '@/const/colors';
import { Authenticator, ThemeProvider, useTheme } from '@aws-amplify/ui-react';
import logo from './assets/images/logo.png';
import { primaryColor, primaryHoverColor } from './const/colors';
import { ApiContextProvider } from './context/ApiContextProvider';
import { DataContextProvider } from './context/DataContextProvider';
import { UserContextProvider } from './context/UserContextProvider';
import router from './routers';
import 'react-toastify/dist/ReactToastify.css';

interface AppProps {
    user?: AuthUser;
}

const components = {
    Header() {
        return (
            <div className="flex justify-center my-5">
                <img src={logo} alt="logo" width={50} height={50} />
            </div>
        );
    },
    Footer() {
        return (
            <footer className="py-5">
                <p className="text-[#999] text-[13px] leading-4 font-normal font-appleFont text-center">
                    Hightainment © 2024. All rights reserved.
                </p>
            </footer>
        );
    },
};

function App({ user }: AppProps) {
    const deviceType = isMobile ? 'Mobile' : 'Desktop';
    const { tokens } = useTheme();

    React.useEffect(() => {
        ReactGA.initialize('G-7M8VS7YWKK');
        ReactGA.send({ hitType: 'pageview', page: window.location.pathname, title: 'App.tsx' });
        ReactGA.event({
            category: 'User Interaction',
            action: `Open in ${deviceType}`,
            label: deviceType,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const theme = {
        name: 'Hightainment Auth Theme',
        tokens: {
            colors: {
                font: {
                    primary: 'white',
                    secondary: primaryColor,
                },
            },
            components: {
                authenticator: {
                    router: {
                        boxShadow: `0 0 16px ${tokens.colors.overlay['10']}`,
                        borderBottomWidth: '1',
                        backgroundColor: mainBackgroundColor,
                        color: 'white',
                    },
                    form: {
                        padding: `${tokens.space.medium} ${tokens.space.xl} ${tokens.space.medium}`,
                    },
                },
                button: {
                    primary: {
                        backgroundColor: primaryColor,
                        _hover: {
                            backgroundColor: primaryHoverColor,
                        },
                    },
                    link: {
                        color: primaryColor,
                    },
                },
                fieldcontrol: {
                    _focus: {
                        boxShadow: `0 0 0 2px ${primaryColor}`,
                    },
                },
                field: {
                    label: {
                        color: 'white', // Set field name (label) color to white
                    },
                },
                tabs: {
                    item: {
                        color: 'white',
                        _active: {
                            borderColor: primaryColor,
                            color: primaryColor,
                        },
                        _hover: {
                            color: primaryColor,
                        },
                    },
                },
            },
        },
    };
    return (
        <ThemeProvider theme={theme}>
            <Authenticator components={components} socialProviders={[]}>
                {({ signOut, user }) => (
                    <div className="App">
                        <UserContextProvider user={user}>
                            <ApiContextProvider>
                                <DataContextProvider>
                                    <RouterProvider router={router} />
                                    <ToastContainer
                                        position="bottom-center"
                                        autoClose={1000}
                                        hideProgressBar={true}
                                        closeOnClick
                                        rtl={false}
                                        theme="colored"
                                        style={{
                                            textAlign: 'center', // Center-align the content
                                        }}
                                        toastStyle={{
                                            margin: '0 auto',
                                            backgroundColor: primaryColor, // Global background color
                                            color: secondaryTextColor, // Global text color
                                            width: 250,
                                        }}
                                    />
                                </DataContextProvider>
                            </ApiContextProvider>
                        </UserContextProvider>
                    </div>
                )}
            </Authenticator>
        </ThemeProvider>
    );
}

export default App;
