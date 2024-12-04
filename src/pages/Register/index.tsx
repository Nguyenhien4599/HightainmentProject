import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import logo from '@/assets/images/5f5356c6bf7ad09a4bc9223cf055cfcc.png';
import icon from '@/assets/images/c8.svg';
import icon1 from '@/assets/images/c9.svg';

const schema = z
    .object({
        name: z.string().min(1, 'Enter your name'),
        dateOfBirth: z.string().min(1, 'Enter date of birth'),
        ID: z.string().min(1, 'Enter your ID'),
        passWord: z.string().min(1, 'Enter your password'),
        confirmPassword: z.string().min(1, 'Enter your confirm password'),
    })
    .refine((data) => data.passWord === data.confirmPassword, {
        message: 'Passwords must match',
        path: ['confirmPassword'],
    });

export default function Index() {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: {
            name: '',
            dateOfBirth: '',
            ID: '',
            passWord: '',
            confirmPassword: '',
        },
    });

    const [dateOfBirthState, setDateOfBirthState] = React.useState<Date | null>(null);

    const handleChangeDate = (val: Date | null) => {
        setDateOfBirthState(val);
        setValue('dateOfBirth', moment(val).format('YYYY-MM-DD'), { shouldValidate: true });
    };

    const onSubmit = (data: any) => {
    };

    return (
        <section className="flex justify-center items-center flex-col">
            <div className="w-[400px] sm-md:px-3 sm-md:w-full">
                <img src={logo} alt="logo" className="mx-auto mt-[86px] mb-[60px] sm-md:mt-[30px]" />
                <div className="mb-[86px] w-full">
                    {Object.keys(errors).length && (
                        <div className="py-3 px-4 mb-3 bg-[#222] border border-customColor-primary rounded-lg">
                            <h3 className="flex gap-[10px] items-center">
                                <img src={icon} alt="icon" />
                                <span className="text-customColor-primary text-sm leading-none font-medium tracking-[-0.5px]">
                                    There was a problem
                                </span>
                            </h3>

                            <ul className="mt-[14px]">
                                {Object.keys(errors).map((e, i) => (
                                    <li
                                        key={i}
                                        className="text-[#BBB] mb-[10px] text-sm leading-none font-medium tracking-[-0.5px] ps-[30px] relative after:absolute after:content-[''] after:w-1 after:h-1 after:rounded-full after:bg-[#BBB] after:left-[3%] after:top-1/2 after:translate-y-[-50%]"
                                    >
                                        {(errors as any)[e].message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <form className="mb-[32px]" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-2">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        id="name"
                                        {...field}
                                        placeholder="First and last name (Required)"
                                        className={clsx(
                                            'placeholder-custom w-full px-4 py-3 outline-none bg-[#222] rounded-lg border text-sm leading-none font-normal tracking-[-0.5px] text-[#BBB]',
                                            errors.name ? 'border-red-400' : 'border-[#434343]',
                                        )}
                                    />
                                )}
                            />
                        </div>
                        <div className="mb-2">
                            <Controller
                                name="dateOfBirth"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        id="dateOfBirth"
                                        {...field}
                                        selected={dateOfBirthState}
                                        placeholderText="Date of birth (Required)"
                                        dateFormat="yyyy-MM-dd"
                                        onChange={handleChangeDate}
                                        className={clsx(
                                            'w-full px-4 py-3 outline-none bg-[#222] rounded-lg border text-sm leading-none font-normal tracking-[-0.5px] text-[#BBB]',
                                            errors.dateOfBirth ? 'border-red-400' : 'border-[#434343]',
                                        )}
                                    />
                                )}
                            />
                        </div>
                        <div className="mb-2">
                            <Controller
                                name="ID"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        id="ID"
                                        placeholder="ID (Required)"
                                        {...field}
                                        className={clsx(
                                            'placeholder-custom w-full px-4 py-3 outline-none bg-[#222] rounded-lg border text-sm leading-none font-normal tracking-[-0.5px] text-[#BBB]',
                                            errors.ID ? 'border-red-400' : 'border-[#434343]',
                                        )}
                                    />
                                )}
                            />
                        </div>
                        <div className="mb-2">
                            <Controller
                                name="passWord"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="password"
                                        id="passWord"
                                        placeholder="PassWord (Required)"
                                        {...field}
                                        className={clsx(
                                            'placeholder-custom w-full px-4 py-3 outline-none bg-[#222] rounded-lg border text-sm leading-none font-normal tracking-[-0.5px] text-[#BBB]',
                                            errors.passWord ? 'border-red-400' : 'border-[#434343]',
                                        )}
                                    />
                                )}
                            />
                        </div>
                        <div className="mb-8">
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        placeholder="Confirm PassWord (Required)"
                                        {...field}
                                        className={clsx(
                                            'placeholder-custom w-full px-4 py-3 outline-none bg-[#222] rounded-lg border text-sm leading-none font-normal tracking-[-0.5px] text-[#BBB]',
                                            errors.confirmPassword ? 'border-red-400' : 'border-[#434343]',
                                        )}
                                    />
                                )}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full h-[45px] text-center text-lg leading-none font-semibold text-white bg-customColor-primary rounded-[50px] border border-[#99999926]"
                        >
                            Sign Up
                        </button>
                    </form>
                    <div className="text-[#BBB] text-sm leading-none font-normal tracking-[-0.5px] font-notoSansKr">
                        <p className="mb-2">By creating an account, you agree to Hightainment</p>
                        <p className="mb-8">
                            <Link to="/" className="text-customColor-primary">
                                Privacy Policy
                            </Link>
                            &nbsp; and&nbsp;&nbsp;
                            <Link to="/" className="text-customColor-primary">
                                Terms of Use
                            </Link>
                        </p>
                        <p className="pt-8 border-t border-[#444]">
                            Already have an account?&nbsp;&nbsp;
                            <Link to="/login" className="text-customColor-primary inline-flex items-center">
                                Sign in &nbsp;&nbsp;
                                <img src={icon1} alt="icon" />
                            </Link>
                        </p>
                    </div>
                </div>
                <footer className="sm-md:pb-6 pb-8">
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
