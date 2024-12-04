import { Link } from 'react-router-dom';

import logo from '@/assets/images/5f5356c6bf7ad09a4bc9223cf055cfcc.png';
import icon1 from '@/assets/images/iconSocial1.svg';
import icon2 from '@/assets/images/iconSocial2.svg';
import icon3 from '@/assets/images/iconSocial3.svg';

export default function Index() {
    return (
        <section className="flex justify-center items-center flex-col">
            <div className="w-[400px] sm-md:px-3 sm-md:w-full">
                <img src={logo} alt="logo" className="mx-auto mt-[86px] mb-[60px] sm-md:mt-[30px]" />
                <div className="mb-[68px]">
                    <form>
                        <div className="mb-4 rounded-lg overflow-hidden">
                            <input
                                type="text"
                                placeholder="ID"
                                className="w-full px-4 py-3 text-sm leading-none outline-none border-b border-b-[#BBB]"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-3 text-sm leading-none outline-none"
                            />
                        </div>
                        <button className="w-full h-[45px] text-center text-lg leading-none font-semibold text-white bg-customColor-primary rounded-[50px] border border-[#99999926]">
                            Sign In
                        </button>
                        <nav className="mt-6 mb-[32px] grid grid-cols-[auto_2px_max-content_2px_auto] gap-x-2">
                            <Link
                                className="text-[#9D9D9D] self-center cursor-pointer text-xs leading-none font-medium uppercase text-right"
                                to="/register"
                            >
                                Sign up
                            </Link>
                            <span className="text-[#9D9D9D]">|</span>
                            <Link
                                className="text-[#9D9D9D] self-center cursor-pointer text-xs leading-none font-medium uppercase"
                                to="/"
                            >
                                FIND ID
                            </Link>
                            <span className="text-[#9D9D9D]">|</span>
                            <Link
                                className="text-[#9D9D9D] self-center cursor-pointer text-xs leading-none font-medium uppercase"
                                to="/"
                            >
                                FIND PW
                            </Link>
                        </nav>
                        <div className="grid grid-rows-3 gap-y-4">
                            <button className="w-full py-3 px-5 border border-[#fff] rounded-[50px] cursor-pointer flex items-center gap-2.5">
                                <img src={icon1} alt="img" />
                                <span className="text-white text-center flex-1">Continue with Google</span>
                            </button>
                            <button className="w-full py-3 px-5 border border-[#fff] rounded-[50px] cursor-pointer flex items-center gap-2.5">
                                <img src={icon2} alt="img" />
                                <span className="text-white text-center flex-1">Continue with Facebook</span>
                            </button>
                            <button className="w-full py-3 px-5 border border-[#fff] rounded-[50px] cursor-pointer flex items-center gap-2.5">
                                <img src={icon3} alt="img" />
                                <span className="text-white text-center flex-1">Continue with Apple</span>
                            </button>
                        </div>
                    </form>
                </div>
                <footer className="sm-md:pb-6">
                    <nav className="mb-[22px] grid grid-cols-3">
                        <Link to="/" className="text-[#999] text-xs leading-4 font-medium text-center">
                            Privacy Policy
                        </Link>
                        <Link to="/" className="text-[#7A7A7A] text-xs leading-4 font-medium text-center">
                            Terms of Use
                        </Link>
                        <Link to="/" className="text-[#7A7A7A] text-xs leading-4 font-medium text-center">
                            Cookie Notice
                        </Link>
                    </nav>
                    <p className="text-[#999] text-[13px] leading-4 font-normal font-appleFont text-center">
                        Hightainment © 2024. All rights reserved.
                    </p>
                </footer>
            </div>
        </section>
    );
}
