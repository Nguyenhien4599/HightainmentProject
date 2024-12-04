import React from 'react';

interface Props {
    children: React.ReactNode;
}

export default function Index({ children }: Props) {
    return <h2 className="text-white text-2xl leading-5 font-500 mb-6 sm-md:mb-4">{children}</h2>;
}
