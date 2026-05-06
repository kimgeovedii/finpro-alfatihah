type Props = {
    level: 1 | 2 | 3 | 4 | 5 | 6
    children: React.ReactNode
    className?: string
}
  
const baseStyles = "tracking-tight"
  
const levelStyles: Record<Props["level"], string> = {
    1: "text-xl md:text-2xl font-bold",
    2: "text-lg md:text-xl font-semibold",
    3: "text-md md:text-lg font-semibold",
    4: "text-base md:text-md font-semibold",
    5: "text-sm md:text-base font-medium",
    6: "text-sm font-normal text-slate-600",
}
  
export const HeadingText = ({ level = 1, children, className = ""}: Props) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements
  
    const styles = `${baseStyles} ${levelStyles[level]} ${className}`
  
    return <Tag className={styles}>{children}</Tag>
}