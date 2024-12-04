import React from 'react';

interface Props {
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export default function Index({ message, onCancel, onConfirm }: Props) {
    return (
        <div className="fixed left-0 right-0 top-0 bottom-0 flex items-center justify-center bg-black bg-opacity-25 z-30">
            <div className="bg-customColor-bgSideBar rounded-lg shadow-lg p-6 max-w-sm w-full border border-customColor-primary">
                <h3 className="text-lg font-semibold text-white">{message}</h3>
                <div className="mt-4 flex justify-end text-white">
                    <button
                        className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button className="bg-customColor-primary px-4 py-2 text-white rounded" onClick={onConfirm}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}
