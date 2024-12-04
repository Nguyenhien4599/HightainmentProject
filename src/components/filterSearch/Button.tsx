import clsx from 'clsx';

interface Props {
    classText: string;
    children: string;
    isActive: boolean;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Button({ classText, children, isActive, onClick }: Props) {
    return (
        <button onClick={onClick} className={clsx(classText, isActive && 'bg-[#999]')}>
            {children}
        </button>
    );
}
