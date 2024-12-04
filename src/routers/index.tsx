import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import PrivateRoute from './privateRoute';
import Loading from '@/components/Loading';

const Layout = React.lazy(() => import('@/layout'));
const Home = React.lazy(() => import('@/pages/Home'));
const Profile = React.lazy(() => import('@/pages/Profile'));
const EditProfile = React.lazy(() => import('@/pages/Profile/Edit'));
const MovieDetails = React.lazy(() => import('@/pages/MovieDetails'));
const SearchResults = React.lazy(() => import('@/pages/SearchResults'));

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <React.Suspense fallback={<Loading />}>
                <Layout>
                    <Home />
                </Layout>
            </React.Suspense>
        ),
    },
    {
        path: '/auras/:auraId',
        element: (
            <React.Suspense fallback={<Loading />}>
                <Layout>
                    <Home />
                </Layout>
            </React.Suspense>
        ),
    },
    {
        path: '/search',
        element: (
            <React.Suspense fallback={<Loading />}>
                <Layout>
                    <SearchResults />
                </Layout>
            </React.Suspense>
        ),
    },
    {
        path: '/watched',
        element: (
            <React.Suspense fallback={<Loading />}>
                <Layout>
                    <SearchResults />
                </Layout>
            </React.Suspense>
        ),
    },
    {
        path: '/watch_later',
        element: (
            <React.Suspense fallback={<Loading />}>
                <Layout>
                    <SearchResults />
                </Layout>
            </React.Suspense>
        ),
    },
    {
        path: '/profile',
        element: (
            <React.Suspense fallback={<Loading />}>
                <PrivateRoute
                    element={
                        <Layout>
                            <Profile />
                        </Layout>
                    }
                />
            </React.Suspense>
        ),
    },
    {
        path: '/profile/edit',
        element: (
            <React.Suspense fallback={<Loading />}>
                <PrivateRoute
                    element={
                        <Layout>
                            <EditProfile />
                        </Layout>
                    }
                />
            </React.Suspense>
        ),
    },
    {
        path: '/titles/:titleId/tracks/:trackId',
        element: (
            <React.Suspense fallback={<Loading />}>
                <Layout>
                    <MovieDetails />
                </Layout>
            </React.Suspense>
        ),
    },
]);

export default router;
