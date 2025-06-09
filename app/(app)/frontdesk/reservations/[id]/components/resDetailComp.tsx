'use client'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { fetchReservation, fetchRooms } from '@/store/actions/roomActions'
import { fetchGuests } from '@/store/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Field, Label } from '@/components/fieldset'
import { useReactToPrint } from "react-to-print";


interface Props {
    id?: string // optional, for edit mode
}

const ResDetailComp = ({ id }: Props) => {
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()

    const contentRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({ contentRef });
    useEffect(() => {
        dispatch(fetchReservation(id) as any);
    }, [id])

    useEffect(() => {
        dispatch(fetchRooms() as any);
        dispatch(fetchGuests() as any).then(() => setLoading(false));
    }, [dispatch])

    const reservation = useSelector((state: RootState) => state?.room?.selected_reservation)
    const guests = useSelector((state: RootState) => state?.user?.guests?.data);

    const guest = guests?.find((g:any) => g.id === reservation?.guestId);


    return (
        <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <Heading>Reservation Form</Heading>
                <Button onClick={reactToPrintFn}>
                    Print
                </Button>
            </div>
            <div className="max-lg:hidden mb-4">
                <Link
                    href="/frontdesk/reservations"
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400"
                >
                    <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
                    Reservation list / <span>{id}</span>
                </Link>
            </div>
            <Divider className="my-5 mt-6" />

            <div ref={contentRef} className='px-16'>
                <div className='flex justify-center items-center '>
                    <Image src="/logo.png" width={200} height={200} alt='logo' />
                </div>
                <Subheading>RUSTIEK HOTEL</Subheading>
                <Subheading>P.O Box 1106, Kasane Botswana</Subheading>
                <Subheading>Tel: 6240168/71287788</Subheading>
                <p className='mt-2'>Guest Registration Card</p>

                <div className='border border-gray-600 pt-4 mt-4'>
                    <div className='flex flex-row gap-4 px-4 pb-2 border-b border-gray-600  ' >
                        <p className=''>Guest Name: </p>
                        <p className='text-sm'>{guest?.firstName} {guest?.lastName}</p>
                    </div>
                    <div className='flex flex-row gap-4 px-4 py-2 border-b border-gray-600  ' >
                        <p className=''>Nationality: </p>
                        <p className='text-sm'>{guest?.country}</p>
                    </div>
                    <div className='flex flex-row gap-4 px-4 py-2 border-b border-gray-600  ' >
                        <p className=''>Passport/Botswana Id: </p>
                        <p className='text-sm'>{guest?.idNo}</p>
                    </div>
                    <div className='flex flex-row gap-4 px-4 py-2   ' >
                        <p className=''>Address: </p>
                        <p className='text-sm'>{guest?.address}</p>
                    </div>
                    <div className='flex flex-row gap-4 px-4 py-2    ' >
                        <p className=''>Tel/Cell: </p>
                        <p className='text-sm'>{guest?.phoneNumber}</p>
                    </div>
                    <div className='flex flex-row gap-4 px-4 py-2 border-b border-gray-600  ' >
                        <p className=''>Email Address: </p>
                        <p className='text-sm'>{guest?.email}</p>
                    </div>
                    <div className='flex flex-row gap-4 px-4 py-2 border-b border-gray-600  ' >
                        <p className=''>Arrival Date: </p>
                        <p className='text-sm'>{reservation?.checkInDate.slice(0, 10)}</p>
                    </div>
                    <div className='flex flex-row gap-4 px-4 py-2 border-b border-gray-600  ' >
                        <p className=''>Departure Date: </p>
                        <p className='text-sm'>{reservation?.checkOutDate.slice(0, 10)}</p>
                    </div>
                    <div className='flex flex-col gap-4 px-4 py-2 border-b border-gray-600  ' >
                        <p className=''>Purpos of Visit: </p>
                        <div className='flex flex-row gap-12'>
                            <div className=''>
                                <Field className='gap-2 flex items-center'>
                                    <input
                                        id="purpose_tourist"
                                        type="checkbox"
                                        checked={reservation?.purpose_tourist}
                                        className="form-checkbox"
                                    />
                                    <Label htmlFor="purpose_tourist">Tourist/Holiday</Label>
                                </Field>
                                <Field className='gap-2 flex items-center'>
                                    <input
                                        id="purpose_tourist"
                                        type="checkbox"
                                        checked={reservation?.purpose_group}
                                        className="form-checkbox"
                                    />
                                    <Label htmlFor="purpose_tourist">Group</Label>
                                </Field>
                            </div>
                            <div className=''>
                                <Field className='gap-2 flex items-center'>
                                    <input
                                        id="purpose_tourist"
                                        type="checkbox"
                                        checked={reservation?.purpose_conference}
                                        className="form-checkbox"
                                    />
                                    <Label htmlFor="purpose_tourist">Conference</Label>
                                </Field>
                                <Field className='gap-2 flex items-center'>
                                    <input
                                        id="purpose_tourist"
                                        type="checkbox"
                                        checked={reservation?.purpose_business}
                                        className="form-checkbox"
                                    />
                                    <Label htmlFor="purpose_tourist">Business</Label>
                                </Field>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-row gap-4 px-4 py-2 border-b border-gray-600  ' >
                        <p className=''>Mode Of Payment: </p>
                        <p className='text-sm'>{reservation?.payment}</p>
                    </div>
                    <div className='flex flex-col gap-4 px-4 py-2    ' >
                        <p className=''>Terms and conditions: </p>
                        <ul className='list-disc pl-6 text-sm'>
                            <li>All guests must register at the front desk</li>
                            <li>Check in is from 14 00 hrs</li>
                            <li>Check out is at 11 00 hrs</li>
                            <li>Late check out is only permitted with management consent</li>
                            <li>Guests may not leave without full payment of services rendered unless permitted by management</li>
                            <li>Pets are not allowed on the premises</li>
                            <li>In-house guest may only cancel next day booking the night prior to checking out</li>
                            <li>No in-room parties allowed</li>
                        </ul>
                        <p className='mt-4'>Guest Signature: _________________________________ </p>

                    </div>
                </div>


                <p className='mt-6'>FOR HOTEL USE</p>

                <div className='border border-gray-600 pt-4 mt-2'>
                    <div className='grid grid-cols-2 gap-4 px-4 pb-2 border-b border-gray-600  ' >
                        <div className='flex flex-row  gap-4  ' >
                            <p className=''>Room Number: </p>
                            <p className='text-sm'>{reservation?.room?.number}</p>
                        </div>
                        <div className='flex flex-row gap-4   ' >
                            <p className=''>Room Type: </p>
                            <p className='text-sm'>{reservation?.room?.type}</p>
                        </div>
                    </div>
                    <div className='flex flex-row gap-4 px-4 pb-2 pt-2 border-b border-gray-600  ' >
                        <p className=''>Room Rate: </p>
                        <p className='text-sm'>{reservation?.room?.pricePerNight}</p>
                    </div>
                    <div className='grid grid-cols-3 gap-4 px-4 pt-2 pb-2 border-b border-gray-600  ' >
                        <div className='flex flex-row  gap-4  ' >
                            <p className=''>Adults: </p>
                            <p className='text-sm'>{reservation?.adults}</p>
                        </div>
                        <div className='flex flex-row gap-4   ' >
                            <p className=''>Children: </p>
                            <p className='text-sm'>{reservation?.children}</p>
                        </div>
                        <div className='flex flex-row gap-4   ' >
                            <p className=''>Extra Bed: </p>
                            <p className='text-sm'>{reservation?.extraBed ? 'Yes' : 'No'}</p>
                        </div>
                    </div>
                    <div className='flex flex-row gap-4 px-4 pb-2 pt-2 border-b border-gray-600  ' >
                        <p className=''>Booked By: </p>
                        <p className='text-sm'>{reservation?.bookedBy}</p>
                    </div>
                    <div className='flex flex-row gap-4 h-9 px-4 pb-2 pt-2 border-b border-gray-600  ' >
                    </div>
                    <div className='grid grid-cols-2 gap-4 px-4 pb-2 pt-2  ' >
                        <div className='flex flex-row  gap-4  ' >
                            <p className=''>Receptionist: </p>
                            <p className='text-sm'>{reservation?.receiptionist}</p>
                        </div>
                        <div className='flex flex-row gap-4   ' >
                            <p className=''>Duty Manager: </p>
                            <p className='text-sm'>{reservation?.dutyManager}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default ResDetailComp