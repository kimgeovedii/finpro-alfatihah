"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BuildingLibraryIcon, DevicePhoneMobileIcon, QrCodeIcon, CreditCardIcon, QuestionMarkCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { HeadingText } from "./HeadingText";
import { BankInformationCard } from "./BankInformationCard";

export const PaymentHelpDialog: React.FC = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="text-emerald-700 bg-transparent text-sm font-bold hover:text-emerald-600 transition-colors hover:bg-transparent shadow-none">
                    <QuestionMarkCircleIcon className="w-5 h-5"/> Help Me
                </Button>
            </DialogTrigger>
            <DialogContent className="[&>button:last-child]:hidden sm:max-w-2xl rounded-3xl border-slate-200 p-0 overflow-hidden">
                <Button className="absolute right-5 top-5 z-50 rounded-full p-2 text-white backdrop-blur transition-colors bg-red-500 shadow hover:shadow-xl hover:scale-125 transition-all duration-300"
                    onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))}>
                    <XMarkIcon className="w-5 h-5" />
                </Button>
                <div className="bg-linear-to-r from-emerald-800 to-emerald-600 p-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-extrabold tracking-tight">Payment Guide</DialogTitle>
                        <DialogDescription className="text-emerald-50 mt-2">Follow the payment instructions below to complete your order safely and quickly.</DialogDescription>
                    </DialogHeader>
                </div>
                <div className="p-6 pt-0 space-y-8 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-4">
                        <div>
                            <HeadingText level={3} children="Manual Method"/>
                            <p className="text-sm text-slate-500 mt-1">Use manual transfer methods for direct payments.</p>
                        </div>
                        <Accordion type="single" collapsible className="space-y-4">
                            <AccordionItem value="scan-qr" className="border border-slate-200 rounded-2xl px-5">
                                <AccordionTrigger className="[&>svg]:hidden hover:no-underline py-5">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl">
                                        <QrCodeIcon className="w-5 h-5"/>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-900">Scan QR</p>
                                        <p className="text-sm text-slate-500">Fast payment using QR code</p>
                                    </div>
                                </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-5 text-sm text-slate-600 leading-7">
                                    <ol className="list-decimal pl-5 space-y-2">
                                        <li>Open your mobile banking or e-wallet application.</li>
                                        <li>Select the “Scan QR” feature.</li>
                                        <li>Scan the QR code displayed on the checkout page.</li>
                                        <li>Verify payment details carefully.</li>
                                        <li>Complete the payment and wait for confirmation.</li>
                                    </ol>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="bank-transfer" className="border border-slate-200 rounded-2xl px-5">
                                <AccordionTrigger className="[&>svg]:hidden hover:no-underline py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl">
                                            <BuildingLibraryIcon className="w-5 h-5"/>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-slate-900">Transfer via Bank</p>
                                            <p className="text-sm text-slate-500">Bank Mandiri virtual account</p>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-5 text-sm text-slate-600">
                                    <div className="bg-slate-100 rounded-2xl p-4 mb-4">
                                        <BankInformationCard/>
                                    </div>
                                    <ol className="list-decimal pl-5 space-y-2">
                                        <li>Open your banking application.</li>
                                        <li>Select “Transfer to Bank Account”.</li>
                                        <li>Input the account number above.</li>
                                        <li>Enter the exact payment amount.</li>
                                        <li>Complete the transfer process.</li>
                                    </ol>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="atm" className="border border-slate-200 rounded-2xl px-5">
                                <AccordionTrigger className="[&>svg]:hidden hover:no-underline py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl">
                                            <CreditCardIcon className="w-5 h-5"/>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-slate-900">Transfer via ATM</p>
                                            <p className="text-sm text-slate-500">ATM transfer instructions</p>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-5 text-sm text-slate-600 leading-7">
                                    <ol className="list-decimal pl-5 space-y-2">
                                        <li>Insert your ATM card and PIN.</li>
                                        <li>Select “Transfer”.</li>
                                        <li>Choose “Transfer to Another Bank Account”.</li>
                                        <li>Enter the Mandiri account number.</li>
                                        <li>Input the exact payment amount.</li>
                                        <li>Confirm all details and finish the transaction.</li>
                                    </ol>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="m-bank" className="border border-slate-200 rounded-2xl px-5">
                                <AccordionTrigger className="[&>svg]:hidden hover:no-underline py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-emerald-100 text-emerald-700 p-2 rounded-xl">
                                            <DevicePhoneMobileIcon className="w-5 h-5"/>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-bold text-slate-900">Transfer via M-Banking</p>
                                            <p className="text-sm text-slate-500">Mobile banking transfer guide</p>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pb-5 text-sm text-slate-600 leading-7">
                                    <ol className="list-decimal pl-5 space-y-2">
                                        <li>Login to your mobile banking application.</li>
                                        <li>Select “Transfer” or “Virtual Account”.</li>
                                        <li>Input the payment account number.</li>
                                        <li>Verify your payment details.</li>
                                        <li>Confirm payment using your PIN or biometric.</li>
                                    </ol>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <HeadingText level={3} children="Gateway Method"/>
                            <p className="text-sm text-slate-500 mt-1">Use your preferred e-wallet for instant payment.</p>
                        </div>
                        <Accordion type="single" collapsible className="space-y-4">
                        <AccordionItem value="ovo" className="border border-slate-200 rounded-2xl px-5">
                            <AccordionTrigger className="[&>svg]:hidden hover:no-underline py-5 font-bold text-slate-900">OVO</AccordionTrigger>
                            <AccordionContent className="pb-5 text-sm text-slate-600 leading-7">
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>Select OVO during checkout.</li>
                                    <li>Enter your registered phone number.</li>
                                    <li>Open your OVO application.</li>
                                    <li>Approve the payment notification.</li>
                                    <li>Wait until payment is completed successfully.</li>
                                </ol>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="dana" className="border border-slate-200 rounded-2xl px-5">
                            <AccordionTrigger className="[&>svg]:hidden hover:no-underline py-5 font-bold text-slate-900">DANA</AccordionTrigger>
                            <AccordionContent className="pb-5 text-sm text-slate-600 leading-7">
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>Select DANA as your payment method.</li>
                                    <li>You will be redirected to DANA payment page.</li>
                                    <li>Login to your DANA account.</li>
                                    <li>Confirm the payment amount.</li>
                                    <li>Complete the transaction securely.</li>
                                </ol>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="gopay" className="border border-slate-200 rounded-2xl px-5">
                            <AccordionTrigger className="[&>svg]:hidden hover:no-underline py-5 font-bold text-slate-900">GoPay</AccordionTrigger>
                            <AccordionContent className="pb-5 text-sm text-slate-600 leading-7">
                                <ol className="list-decimal pl-5 space-y-2">
                                    <li>Select GoPay on the payment page.</li>
                                    <li>Open your Gojek application.</li>
                                    <li>Check incoming payment notification.</li>
                                    <li>Review transaction details carefully.</li>
                                    <li>Confirm and finish your payment.</li>
                                </ol>
                            </AccordionContent>
                        </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}