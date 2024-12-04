import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserSidebar() {
    const navigate = useNavigate();

    return (
        <div className="pe-3 self-end mt-3">
            <nav>
                <div
                    style={{
                        padding: 20,
                        backgroundColor: '#111',
                        borderRadius: 12,
                        height: 100,
                        alignContent: 'center',
                        color: 'white',
                        fontSize: 20,
                        cursor: 'pointer',
                    }}
                    onClick={() => navigate('/watched')}
                >
                    Watched
                </div>
                <div
                    style={{
                        marginTop: 8,
                        padding: 20,
                        backgroundColor: '#111',
                        borderRadius: 12,
                        height: 100,
                        alignContent: 'center',
                        color: 'white',
                        fontSize: 20,
                        cursor: 'pointer',
                    }}
                    onClick={() => navigate('/watch_later')}
                >
                    Watch Later
                </div>
            </nav>
        </div>
    );
}
