type Props = {
    context: string
    val: string
}

export const MiniTagBox: React.FC<Props> = ({ context, val }) => {
    return <span className="inline-block mt-1 text-xs font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md">{context}: {val}</span>
}
