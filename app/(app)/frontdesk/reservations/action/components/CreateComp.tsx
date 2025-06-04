// Created by kev, 2023-10-05 12:00:00
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { Field as Fieldz, Formik } from 'formik'
import * as Yup from 'yup'
import { RootState } from '@/store'
import { fetchGuests } from '@/store/actions/userActions'
import { fetchRooms } from '@/store/actions/roomActions'
import FormikInput from '@/components/app/FormikField'
import { Button } from '@/components/button'
import { Checkbox, CheckboxField } from '@/components/checkbox'
import { Divider } from '@/components/divider'
import { Field, Label } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Select } from '@/components/select'
import LoadingComp from '../../../Loading'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import GuestSelectCombobox from '@/components/app/GuestCombo'

interface Props {
    id?: string // optional, for edit mode
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}



export default function CreateReserve({ id }: Props) {
    const router = useRouter()
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(true)
    const [reservationData, setReservationData] = useState<any>(null)
    const isEditMode = !!id

    useEffect(() => {
        dispatch(fetchRooms());
        dispatch(fetchGuests()).then(() => setLoading(false));
    }, [dispatch])

    const guests = useSelector((state: RootState) => state?.user?.guests?.data);

  
    // useEffect(() => {
    //     const loadInitialData = async () => {  
    //         if (isEditMode) {
    //             try {
    //                 const res = await fetch(`/api/reservations/${id}`)
    //                 const data = await res.json()
    //                 setReservationData(data)
    //             } catch (err) {
    //                 console.error('Failed to fetch reservation data', err)
    //             }
    //         }
    //         setLoading(false)
    //     }
    //     loadInitialData()
    // }, [id, isEditMode])



    const guest = useSelector((state: RootState) => state?.user?.selected_guest?.data);
    const rooms = useSelector((state: RootState) => state?.room?.rooms?.data || [])

    const handleSubmit = async (values: any) => {
        setLoading(true)

        const method = isEditMode ? 'PATCH' : 'POST'
        const url = isEditMode ? `api/action` : 'api'

        const body = {
            guestId: values.guestId,
            roomId: values.roomId,
            checkInDate: values.checkInDate,
            checkOutDate: values.checkOutDate,
            adults: values.adults,
            children: values.children,
            extraBed: values.extraBed,
            bookedBy: values.bookedBy,
            receptionist: values.receptionist,
            dutyManager: values.dutyManager,
            status: values.status,
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
        <Formik
            enableReinitialize
            initialValues={{
                guestId: guest?.guestId || '',
                roomId: guest?.roomId || '',
                checkInDate: guest?.checkInDate?.slice(0, 10) || '',
                checkOutDate: guest?.checkOutDate?.slice(0, 10) || '',
                adults: guest?.adults || '',
                children: guest?.children || '',
                extraBed: guest?.extraBed || false,
                bookedBy: guest?.bookedBy || '',
                receptionist: guest?.receptionist || '',
                dutyManager: guest?.dutyManager || '',
                status: guest?.status || 'PENDING',
                signature: '',
            }}
            validationSchema={Yup.object().shape({
                guestId: Yup.string().required('Guest is required'),
                roomId: Yup.string().required('Room is required'),
                checkInDate: Yup.date().required('Check-in date is required'),
                checkOutDate: Yup.date()
                    .required('Check-out date is required')
                    .min(Yup.ref('checkInDate'), 'Check-out must be after check-in'),
                adults: Yup.number().required('Required').min(1, 'At least one adult'),
                children: Yup.number().min(0, 'Cannot be negative'),
                extraBed: Yup.boolean(),
                bookedBy: Yup.string().required('Booked by is required'),
                receptionist: Yup.string().required('Receptionist is required'),
                dutyManager: Yup.string().required('Duty manager is required'),
                status: Yup.string()
                    .oneOf(['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED']),
                signature: Yup.string(),
            })}
            onSubmit={handleSubmit}
        // validateOnBlur
        // validateOnChange
        >
            {({ handleSubmit, handleChange, isSubmitting, errors, touched, values, resetForm }) => (
                <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
                    <Heading>{isEditMode ? 'Edit Reservation' : 'Create Reservation'}</Heading>

                    <div className="max-lg:hidden mb-4">
                        <Link
                            href="/frontdesk/reservations"
                            className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400"
                        >
                            <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
                            Reservation list
                        </Link>
                    </div>

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
                            <Label>Room</Label>
                            <Select name="roomId" value={values.roomId} onChange={handleChange}>
                                <option value="">Select Room</option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        Room No. {room.number}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                        <Field>
                            <Label>Guest</Label>
                            {guests.length > 0 ? (
                                <GuestSelectCombobox
                                    name="guestId"
                                    options={guests}
                                    displayValue={(g) => g?.firstName}
                                />
                            ) : (
                                <p className="text-sm text-zinc-500">Loading guests...</p>
                            )}
                            {/* <Select name="guestId" value={values.guestId} onChange={handleChange}>
                                <option value="">Select Guest</option>
                                {guests.map((guest) => (
                                    <option key={guest.id} value={guest.id}>
                                        {guest.firstName} {guest.lastName}
                                    </option>
                                ))}
                            </Select> */}
                        </Field>
                    </section>

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
                        <FormikInput label="Adults" name="adults" type="number" />
                        <FormikInput label="Children" name="children" type="number" />
                    </section>

                    <Divider className="my-5" soft />

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <CheckboxField>
                            <Checkbox name="extraBed" />
                            <Label>Extra Bed</Label>
                        </CheckboxField>
                    </section>

                    <Divider className="my-5" soft />

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <FormikInput label="Booked By" name="bookedBy" type="text" />
                        <FormikInput label="Receptionist" name="receptionist" type="text" />
                    </section>

                    <Divider className="my-5" soft />

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
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
            )}
        </Formik>
    )
}
