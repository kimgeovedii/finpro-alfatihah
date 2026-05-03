type Props = {
    val: string
}

export const MiniTagBox: React.FC<Props> = ({ val }) => {
    return <span className="inline-block mt-1 text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md">{val}</span>
}
