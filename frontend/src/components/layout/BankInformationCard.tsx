import { CopyFieldButton } from "../button/CopyFieldButton"
import { HeadingText } from "./HeadingText"

export const BankInformationCard: React.FC = () => {
    return <>
        <HeadingText children="Bank Information" level={4}/>
        <div className="mt-4">
            <div className="flex flex-wrap justify-between items-center">
                <p>Bank</p>
                <p className="font-semibold">Bank Mandiri</p>
            </div>
            <div className="flex flex-wrap justify-between items-center">
                <p>Account Name</p>
                <p className="font-semibold">PT Alfatihah Indonesia</p>
            </div>
            <div className="flex flex-wrap justify-between items-center">
                <p className="font-semibold">Account Number</p>
                <CopyFieldButton label={"Account Number"} value={"1370012345678"}/>
            </div>
        </div>
    </>
}