type Props = {
    extraClass?: string | null
}

export const SkeletonBox: React.FC<Props> = ({ extraClass }) => {
    return (
        <div className='animate-pulse space-y-3 mt-2'>
            <div className={`h-4 bg-gray-300 rounded w-full ${extraClass} rounded-lg`}></div>
        </div>
    )
}
