export default function Skeleton() {
    return (
        <div className="w-[300px] h-[550px] bg-[#444] p-3 flex gap-[15px] flex-col justify-between rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)] sm-md:w-[160px] sm-md:h-[360px] sm-md:p-1 md-lg:w-[205px] md-lg:h-[380px]">
            <div className="animate-skeleton-loading w-full h-[428px] bg-[#555] rounded-lg"></div>
            <div className="animate-skeleton-loading w-4/5 h-[15px] bg-[#555] rounded"></div>
            <div className="animate-skeleton-loading w-3/5 h-[15px] bg-[#555] rounded"></div>
        </div>
    );
}
