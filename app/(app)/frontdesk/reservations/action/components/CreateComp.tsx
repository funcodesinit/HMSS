'use client'
import { Button } from '@/components/button'
import { Heading, Subheading } from '@/components/heading'
import { ChevronLeftIcon } from '@heroicons/react/16/solid'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import LoadingComp from '../../../Loading'
import { fetchReservation, fetchRooms } from '@/store/actions/roomActions'
import { fetchGuests } from '@/store/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'

import { useRouter } from 'next/navigation'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Divider } from '@/components/divider'
import { Field, Fieldset, Label, Legend } from '@/components/fieldset'
import { Select } from '@/components/select'
import { RootState } from '@/store'
import GuestSelectCombobox from '@/components/app/GuestCombo'
import FormikInput from '@/components/app/FormikField'
import { CheckboxField, CheckboxGroup } from '@/components/checkbox'

interface Props {
    id?: string // optional, for edit mode
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function CreateReserve({ id }: Props) {
    const router = useRouter()
    const dispatch = useDispatch()
    const isEditMode = !!id
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        dispatch(fetchReservation(id));
    }, [id])

    useEffect(() => {
        dispatch(fetchRooms());
        dispatch(fetchGuests()).then(() => setLoading(false));
    }, [dispatch]) 
    
    const rooms = useSelector((state: RootState) => state?.room?.rooms?.data)
    const guests = useSelector((state: RootState) => state?.user?.guests?.data);
    const reservation = useSelector((state: RootState) => state?.room?.selected_reservation)

    const handleSubmit = async (values: any) => {
        setLoading(true)

        const method = isEditMode ? 'PATCH' : 'POST'
        const url = isEditMode ? `/frontdesk/reservations/${id}/api` : '/frontdesk/reservations/api'

        const body = {
            guestId: values.guestId,
            roomId: values.roomId,
            checkInDate: values.checkInDate,
            checkOutDate: values.checkOutDate,
            adults: values.adults,
            child: values.child,
            extraBed: values.extraBed,
            bookedBy: values.bookedBy,
            receptionist: values.receptionist,
            dutyManager: values.dutyManager,
            purpose_tourist: values.purpose_tourist,
            purpose_conference: values.purpose_conference,
            purpose_group: values.purpose_group,
            purpose_business: values.purpose_business,
            paymentMethod: values.paymentMethod,
            status: values.status,
            // signature: values.signature,
        }

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
            if (!response.ok) throw new Error('Failed to save reservation')
            router.push('/frontdesk/reservations')
        } catch (error) {
            console.error('Error:', error)
            alert('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    } 

    if (loading) return <LoadingComp />

    return (
        <div>
            <div className='flex items-center justify-between mb-4'>
                <Heading>{isEditMode ? 'Reservation Form ' : 'Reservation Form'}</Heading>
               
            </div>

            <div className="max-lg:hidden mb-4">
                <Link
                    href="/frontdesk/reservations"
                    className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400"
                >
                    <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
                    Reservation list
                </Link>
            </div>
            <Formik
                initialValues={{
                    guestId: reservation?.guestId || '',
                    guest: null,
                    roomId: reservation?.roomId || '',
                    checkInDate: reservation?.checkInDate.slice(0, 10) || '',
                    checkOutDate: reservation?.checkOutDate.slice(0, 10) || '',
                    adults:  reservation?.adults || '1',
                    child: reservation?.children || '0',
                    extraBed: reservation?.extraBed || false,
                    bookedBy: reservation?.bookedBy || '',
                    receptionist: reservation?.receiptionist || '',
                    dutyManager:  reservation?.dutyManager || '',
                    status: reservation?.status || 'PENDING',
                    purpose_tourist:  reservation?.purpose_tourist || false,
                    purpose_conference: reservation?.purpose_conference || false,
                    purpose_group:reservation?.purpose_group ||  false,
                    purpose_business: reservation?.purpose_business || false,
                    paymentMethod: reservation?.paymentMethod || 'CASH',
                    // signature: reservation?.signature || '',
                }}
                validationSchema={Yup.object().shape({
                    guestId: Yup.string().required('Guest is required'),
                    roomId: Yup.string().required('Room is required'),
                    checkInDate: Yup.date().required('Check-in date is required'),
                    checkOutDate: Yup.date()
                        .required('Check-out date is required')
                        .min(Yup.ref('checkInDate'), 'Check-out must be after check-in'),
                    adults: Yup.string(),
                    child: Yup.string(),
                    extraBed: Yup.boolean(),
                    bookedBy: Yup.string().required('Booked by is required'),
                    receptionist: Yup.string().required('Receptionist is required'),
                    dutyManager: Yup.string().required('Duty manager is required'),
                    status: Yup.string()
                        .oneOf(['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED']),
                    paymentMethod: Yup.string().oneOf(['CASH', 'COMPANY', 'CARD']),
                    // signature: Yup.string(),
                })}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, handleChange, isSubmitting, errors, touched, values, resetForm, setFieldValue }) => {

                    useEffect(() => {
                        const selectedGuest = guests?.find((g) => g.id === values?.guestId);
                        if (selectedGuest) {
                            setFieldValue('guest', selectedGuest);
                        }
                    }, [values.guestId, guests, setFieldValue]);

                    return (
                        <form onSubmit={handleSubmit} className="w-full max-w-4xl">
                            <Divider className="my-5 mt-6" />

                            {Object.keys(errors).length > 0 && (

                                <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-4">
                                    <ul className="list-disc list-inside text-sm text-red-700">
                                        {Object.entries(errors).map(([field, message]) => (
                                            <li key={field}>
                                                {typeof message === 'string' ? message : 'Invalid value'}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">

                                <Field>
                                    <Label>Select Room</Label>
                                    <Select name="roomId" value={values.roomId} onChange={handleChange}>
                                        <option value="">Select Room</option>
                                        {rooms?.map((room) => (
                                            <option key={room.id} value={room.id}>
                                                Room No. {room.number} - {room.type} - {room.status}
                                            </option>
                                        ))}
                                    </Select>
                                </Field>

                                <Field>
                                    <Label>Select Guest</Label>
                                    {guests?.length > 0 ? (
                                        <GuestSelectCombobox
                                            name="guestId"
                                            options={guests}
                                            displayValue={(g) => `${g?.firstName}`}
                                        />
                                    ) : (
                                        <p className="text-sm text-zinc-500">Loading guests...</p>
                                    )}

                                </Field>

                            </section>

                            <Divider className="my-5 mt-6" />
                            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                <FormikInput label="First Name" name="guest.firstName" type="text" disabled />
                                <FormikInput label="Last Name" name="guest.lastName" type="text" disabled />
                            </section>
                            <Divider className="my-5" soft />

                            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                <FormikInput label="Email" name="guest.email" type="email" disabled />
                                <FormikInput label="Phone Number" name="guest.phoneNumber" type="text" disabled />
                            </section>

                            <Divider className="my-5" soft />

                            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                <FormikInput label="Company" name="guest.company" type="text" disabled />
                                <FormikInput label="Address" name="guest.address" type="text" disabled />
                            </section>

                            <Divider className="my-5" soft />

                            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                <FormikInput label="ID No" name="guest.idNo" type="text" disabled />
                                <FormikInput label="City" name="guest.city" type="text" disabled />
                                <FormikInput label="Province" name="guest.province" type="text" disabled />
                                <FormikInput label="Country" name="guest.country" type="text" disabled />
                            </section>
                            <Divider className="my-5" soft />

                            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                <Fieldset>
                                    <Legend>Purpose</Legend>
                                    <CheckboxGroup>
                                        <Field className='gap-2 flex items-center'>
                                            <input
                                                id="purpose_tourist"
                                                name="purpose_tourist"
                                                type="checkbox"
                                                onChange={handleChange}
                                                checked={values?.purpose_tourist}
                                                className="form-checkbox"
                                            />
                                            <Label htmlFor="purpose_tourist">Tourism</Label>
                                        </Field>
                                        <Field className='gap-2 flex items-center'>
                                            <input
                                                id="purpose_conference"
                                                name="purpose_conference"
                                                type="checkbox"
                                                onChange={handleChange}
                                                checked={values?.purpose_conference}
                                                className="form-checkbox"
                                            />
                                            <Label htmlFor="purpose_conference">Conference</Label>
                                        </Field>
                                        <Field className='gap-2 flex items-center'>
                                            <input
                                                id="purpose_group"
                                                name="purpose_group"
                                                type="checkbox"
                                                onChange={handleChange}
                                                checked={values?.purpose_group}
                                                className="form-checkbox"
                                            />
                                            <Label htmlFor="purpose_group">Group</Label>
                                        </Field>
                                        <Field className='gap-2 flex items-center'>
                                            <input
                                                id="purpose_business"
                                                name="purpose_business"
                                                type="checkbox"
                                                onChange={handleChange}
                                                checked={values?.purpose_business}
                                                className="form-checkbox"
                                            />
                                            <Label htmlFor="purpose_business">Business </Label>
                                        </Field>
                                    </CheckboxGroup>
                                </Fieldset>

                                <div className="space-y-6">
                                    <Field>
                                        <Label>Payment Method</Label>
                                        <Select name="paymentMethod">
                                            <option value="CASH">Cash</option>
                                            <option value="COMPANY">Company</option>
                                            <option value="CARD">Card</option>
                                        </Select>
                                    </Field>
                                    <FormikInput label="Signature" name="signature" type="text" />
                                </div>
                            </section>

                            {/* Ts and Cs  */}
                            <div className='mt-5'>
                                <Subheading>Terms and Conditions</Subheading>
                                <ul>
                                    <li>Check in is from 14 00 hrs</li>
                                    <li>Check out is at 11 00 hrs</li>
                                    <li>Late check out is only permitted with management consent</li>
                                    <li>Guests may not leave without full payment of services rendered unless permitted by management</li>
                                    <li>Pets are not allowed on the premises</li>
                                    <li>In-house guest may only cancel next day booking the night prior to checking out</li>
                                    <li>No in-room parties allowed</li>
                                </ul>
                            </div>

                            <Divider className="my-5" soft />
                            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                <FormikInput label="Check-in Date" name="checkInDate" type="date" />
                                <FormikInput
                                    label="Check-out Date"
                                    name="checkOutDate"
                                    type="date"
                                    min={values.checkInDate}
                                />
                            </section>
                            <Divider className="my-5" soft />
                            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                <FormikInput label="Adults" name="adults" />
                                <FormikInput label="Children" name="child" />
                            </section>

                            <Divider className="my-5" soft />



                            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                <Fieldset>
                                    <CheckboxGroup>
                                        <Field className='gap-2 flex items-center'>
                                            <input
                                                id="extraBed"
                                                name="extraBed"
                                                type="checkbox"
                                                onChange={handleChange}
                                                checked={values?.extraBed}
                                                className="form-checkbox"
                                            />
                                            <Label htmlFor="extraBed">extra Bed</Label>
                                        </Field>
                                    </CheckboxGroup>
                                </Fieldset>
                                <FormikInput label="Booked By" name="bookedBy" type="text" />
                            </section>

                            <Divider className="my-5" soft />

                            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                <FormikInput label="Receptionist" name="receptionist" type="text" />
                                <FormikInput label="Duty Manager" name="dutyManager" type="text" />
                            </section>

                            <Divider className="my-5" soft />

                            <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                                <Field>
                                    <Label>Status</Label>
                                    <Select name="status" value={values.status} onChange={handleChange}>
                                        <option value="">Select Status</option>
                                        <option value="PENDING">PENDING</option>
                                        <option value="CONFIRMED">CONFIRMED</option>
                                        <option value="CHECKED_IN">CHECKED_IN</option>
                                        <option value="CHECKED_OUT">CHECKED_OUT</option>
                                        <option value="CANCELLED">CANCELLED</option>
                                    </Select>
                                </Field>
                            </section>

                            <Divider className="my-5" soft />
                            <div className="flex justify-end gap-4">
                                <Button type="button" plain onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button type="submit" disabled={isSubmitting || loading}>
                                    {loading
                                        ? 'Submitting...'
                                        : isEditMode
                                            ? 'Update Reservation'
                                            : 'Create Reservation'}
                                </Button>
                            </div>
                        </form>
                    )
                }}
            </Formik>

        </div>
    )
}