import { Link } from 'react-router-dom';

export default function Index() {
    return (
        <footer className="pt-[30px] pb-[30px] ps-[72px]  col-start-2 col-end-3 sm-md:col-auto sm-md:px-6 sm-md:pt-[72px] sm-md:pb-[110px]">
            <nav className="mb-[22px]">
                <Link to="/" className="text-[#999] text-xs leading-4 font-medium">
                    Privacy Policy
                </Link>
                <Link to="/" className="mx-9 text-[#7A7A7A] text-xs leading-4 font-medium">
                    Terms of Use
                </Link>
                <Link to="/" className="text-[#7A7A7A] text-xs leading-4 font-medium">
                    Cookie Notice
                </Link>
            </nav>
            <p className="text-[#999] text-[13px] leading-4 font-normal font-appleFont">
                Hightainment © 2024. All rights reserved.
            </p>
        </footer>
    );
}
