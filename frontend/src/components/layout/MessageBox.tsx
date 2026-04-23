import Image from "next/image"
import { Button } from "../ui/button"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

type Props = {
    context: string 
    description?: string | null
    image?: string | null
    urlButton?: string | null
    titleButton?: string | null
}

export const MessageBox: React.FC<Props> = ({ context, description, image, urlButton, titleButton } ) => {
    return (
        <div className="p-5 rounded-lg bg-gray-100 border-1 border-gray-200 mx-auto text-center">
            { image && <Image alt={image} src={image} className="w-[50vw] max-w-[150px] min-w-[150px] h-auto mx-auto mb-4" width={100} height={100}/> }
            <p className="text-teal-600 font-medium text-md">- {context} -</p>
            { description && <p className="text-gray-500 text-sm">{description}</p> }
            { 
                urlButton && titleButton && 
                    <Link href={urlButton}>
                        <Button className="bg-teal-600 text-sm p-4 mt-4"><ArrowRightIcon/> {titleButton}</Button> 
                    </Link>
            }
        </div>
    )
}
