import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import clsx from 'clsx';

import icon from '@/assets/images/c10.svg';
import iconClose from '@/assets/images/iconModalBottomToTop.svg';
import { listValidTypesAvatar } from '@/const/list';
import { IUserContext, UserContext } from '@/context/UserContextProvider';
import { ApiContext, IApiContext } from '@/context/ApiContextProvider';
import { avatarUrl } from '@/const/links';

interface IDataUser {
    username: string;
    email: string;
}

export default function Edit() {
    const [user, setUser] = React.useState<IDataUser>();
    const [userBody, setUserBody] = React.useState<IDataUser>({ username: '', email: '' });
    const [urlAvatar, setUrlAvatar] = React.useState(avatarUrl);
    const refToTop = React.useRef<HTMLDivElement | null>(null);
    const refFile = React.useRef<HTMLInputElement | null>(null);
    const { authUser } = useContext<IUserContext>(UserContext);
    const { getUser, updateUser } = React.useContext<IApiContext>(ApiContext);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (authUser) {
            const fetchUser = async () => {
                try {
                    const results = await getUser(authUser.userId);
                    setUser({ ...user, username: results?.username || '', email: results?.email || '' });
                } catch (error) {
                    toast.error(`${error}`);
                }
            };
            fetchUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authUser]);

    const handleChangeAvatar = () => {
        refFile.current && refFile.current.click();
    };
    const handleChangeFile = () => {
        if (refFile.current && refFile.current.files && refFile.current.files.length > 0) {
            const file = refFile.current.files[0];
            if (file) {
                if (!listValidTypesAvatar.includes(file.type)) {
                    toast.error('Invalid file type selected, an image selection is required.');
                    return;
                }
                const url = URL.createObjectURL(file);
                setUrlAvatar(url);
            }
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        userBody && setUserBody({ ...userBody, [e.target.name]: e.target.value });
    };
    const handleUpdateUser = async () => {
        if (authUser && user) {
            try {
                await updateUser(authUser.userId, userBody.username || user.username, userBody.email || user.email);
                toast.success('Update successful');
                setUser(userBody);
            } catch (error) {
                toast.error(`${error}`);
            }
        } else {
            toast.error('Please enter a username');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
        window.location.reload();
    };

    return (
        <section className="sm-md:pe-6 overflow-hidden" ref={refToTop}>
            <header>
                <div className="relative w-[200px] h-[200px] sm-md:w-[100%] sm-md:h-[100%] flex justify-center items-center">
                    <img
                        src={urlAvatar}
                        alt="avatar"
                        className="w-[180px] h-[180px] sm-md:w-[80px] sm-md:h-[80px] rounded-full"
                    />
                    <span
                        onClick={handleChangeAvatar}
                        className="absolute top-[78%] left-[68%]  w-9 h-9 sm-md:w-6 sm-md:h-6 sm-md:top-[80%] sm-md:left-[54%] bg-[#333] rounded-full flex justify-center items-center cursor-pointer"
                    >
                        <img src={icon} alt="icon" className="sm-md:w-4 sm-md:h-4" />
                    </span>
                    <input
                        type="file"
                        className="absolute top-[10000px] opacity-0 invisible"
                        ref={refFile}
                        onChange={handleChangeFile}
                    />
                </div>
            </header>
            <section className="mt-[55px]">
                <h3 className="text-white text-[32px] sm-md:text-2xl sm-md:leading-none font-normal font-Anton mb-4">
                    PERSONAL INFORMATION
                </h3>
                <div className="grid grid-cols-[192px_1fr] gap-x-6 mb-6 sm-md:gap-x-3 sm-md:grid-cols-[166px_1fr]">
                    <span className="text-2xl sm-md:text-xl leading-none font-medium text-white">Current username</span>
                    <span className="text-2xl self-start sm-md:text-xl leading-none font-bold text-white">
                        {user?.username || ''}
                    </span>
                </div>
                <div>
                    <label className="block text-base leading-none text-white font-medium">Username</label>
                    <input
                        name="username"
                        value={userBody.username}
                        onChange={handleChange}
                        type="text"
                        className="text-white w-full font-medium text-2xl leading-none pt-4 pb-2 bg-transparent outline-none border-b border-b-[#D9D9D9]"
                    />
                </div>
                <div className="flex justify-end mt-4 gap-8">
                    <button className="text-2xl sm-md:text-xl leading-none font-normal text-[#EAEAEA]">Cancel</button>
                    <button
                        disabled={!userBody.username ? true : false}
                        onClick={handleUpdateUser}
                        className={clsx(
                            'text-2xl sm-md:text-xl text-white px-3 py-[6px] text-center rounded-lg border border-[#999999]',
                            !userBody.username ? 'bg-[#A9A9A9]' : 'bg-customColor-primary cursor-pointer',
                        )}
                    >
                        Update
                    </button>
                </div>
            </section>
            <section className="mt-[55px]">
                <h3 className="text-white text-[32px] sm-md:text-2xl font-normal font-Anton mb-4">EMAIL ADDRESS</h3>
                <div className="grid grid-cols-[150px_1fr] gap-x-6 mb-6 sm-md:gap-x-3 sm-md:grid-cols-[130px_1fr]">
                    <span className="text-2xl sm-md:text-xl leading-none font-medium text-white">Current email</span>
                    <span className="text-2xl self-start sm-md:text-xl leading-none font-bold text-white show-ellipsis">
                        {user?.email || ''}
                    </span>
                </div>
                <div>
                    <label className="block  text-base leading-none text-white font-medium">E-mail</label>
                    <input
                        name="email"
                        value={userBody.email}
                        onChange={handleChange}
                        type="text"
                        className="text-white w-full font-medium text-2xl leading-none pt-4 pb-2 bg-transparent outline-none border-b border-b-[#D9D9D9]"
                    />
                </div>
                <div className="flex justify-end mt-4 gap-8">
                    <button className="text-2xl sm-md:text-xl leading-none font-normal text-[#EAEAEA]">Cancel</button>
                    <button
                        disabled={!userBody.email ? true : false}
                        onClick={handleUpdateUser}
                        className={clsx(
                            'text-2xl sm-md:text-xl text-white px-3 py-[6px] text-center rounded-lg border border-[#999999]',
                            !userBody.email ? 'bg-[#A9A9A9]' : 'bg-customColor-primary cursor-pointer',
                        )}
                    >
                        Update
                    </button>
                </div>
            </section>
            <nav className="mt-[100px]">
                <Link to="/profile" className="block mb-8 text-white text-2xl sm-md:text-xl leading-none font-normal">
                    My Page
                </Link>
                <span
                    onClick={handleLogout}
                    className="block mb-8 text-white text-2xl sm-md:text-xl leading-none font-normal cursor-pointer"
                >
                    Log Out
                </span>
            </nav>
        </section>
    );
}
