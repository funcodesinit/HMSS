// Created by kev, 2023-10-05 12:00:00
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { Formik } from 'formik'
import * as Yup from 'yup'

import { RootState } from '@/store'
import { fetchGuest } from '@/store/actions/userActions'

import FormikInput from '@/components/app/FormikField'
import { Button } from '@/components/button'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/components/checkbox'
import { Divider } from '@/components/divider'
import { Field, Fieldset, Label, Legend } from '@/components/fieldset'
import { Heading } from '@/components/heading'
import { Text } from '@/components/text'
import { Select } from '@/components/select'
import LoadingComp from '../../../Loading'
import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

interface Props {
    id?: string; // optional, for edit mode
}

export default function CreateGuest({ id }: Props) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const guest = useSelector((state: RootState) => state.user.selected_guest);

    // Fetch only in edit mode
    useEffect(() => {
        if (id) {
            dispatch(fetchGuest(id));
        }
    }, [id]);

    const isEditMode = !!id;

    const handleSubmit = async (values: any) => {
        setLoading(true);

        const method = isEditMode ? 'PATCH' : 'POST';
        const url = isEditMode? `${id}/api` : 'api';

        const body = {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            company: values.company,
            address: values.address,
            idNo: values.idNo,
            city: values.city,
            province: values.province,
            country: values.country,
            purpose_tourist: values.purpose_tourist,
            purpose_conference: values.purpose_conference,
            purpose_group: values.purpose_group,
            purpose_business: values.purpose_business,
            paymentMethod: values.paymentMethod,
            signature: values.signature
        };

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            router.push('/frontdesk/guests');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) return <LoadingComp />;

    return (
        <Formik
            enableReinitialize
            initialValues={{
                firstName: guest?.firstName || '',
                lastName: guest?.lastName || '',
                email: guest?.email || '',
                phoneNumber: guest?.phoneNumber || '',
                company: guest?.company || '',
                address: guest?.address || '',
                idNo: guest?.idNo || '',
                city: guest?.city || '',
                province: guest?.province || '',
                country: guest?.country || '',
                purpose_tourist: guest?.purpose_tourist || false,
                purpose_conference: guest?.purpose_conference || false,
                purpose_group: guest?.purpose_group || false,
                purpose_business: guest?.purpose_business || false,
                paymentMethod: guest?.paymentMethod || 'CASH',
                signature: guest?.signature || '',
            }}
            validationSchema={Yup.object({
                firstName: Yup.string().required("First name is required."),
                lastName: Yup.string().required("Last name is required."),
                email: Yup.string().email('Invalid email address').required('Email is required'),
                phoneNumber: Yup.string().required('Phone number is required'),
                company: Yup.string().required('Company is required'),
                address: Yup.string().required('Address is required'),
                idNo: Yup.string().required('ID No is required'),
                city: Yup.string().required('City is required'),
                province: Yup.string().required('Province is required'),
                country: Yup.string().required('Country is required'),
                paymentMethod: Yup.string().required('Payment method is required'),
                signature: Yup.string().required('Signature is required'),
            })}
            onSubmit={handleSubmit}
        >
            {({ handleSubmit, isSubmitting, errors }) => (
                <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
                    <Heading>{isEditMode ? 'Edit Guest' : 'Create Guest'}</Heading>
                    <div className="max-lg:hidden">
                        <Link href="/frontdesk/guests" className="inline-flex items-center gap-2 text-sm/6 text-zinc-500 dark:text-zinc-400">
                            <ChevronLeftIcon className="size-4 fill-zinc-400 dark:fill-zinc-500" />
                            Guests list
                        </Link>
                    </div>

                    <Divider className="my-5 mt-6" />

                    {Object.keys(errors).length > 0 && (
                        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-4">
                            <ul className="list-disc list-inside text-sm text-red-700">
                                {Object.entries(errors).map(([field, message]) => (
                                    <li key={field}>{typeof message === 'string' ? message : 'Invalid value'}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Guest Personal Info */}
                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <FormikInput label="First Name" name="firstName" type="text" />
                        <FormikInput label="Last Name" name="lastName" type="text" />
                    </section>

                    <Divider className="my-5" soft />

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <FormikInput label="Email" name="email" type="email" />
                        <FormikInput label="Phone Number" name="phoneNumber" type="text" />
                    </section>

                    <Divider className="my-5" soft />

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <FormikInput label="Company" name="company" type="text" />
                        <FormikInput label="Address" name="address" type="text" />
                    </section>

                    <Divider className="my-5" soft />

                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <FormikInput label="ID No" name="idNo" type="text" />
                        <FormikInput label="City" name="city" type="text" />
                        <FormikInput label="Province" name="province" type="text" />
                        <FormikInput label="Country" name="country" type="text" />
                    </section>

                    <Divider className="my-5" soft />

                    {/* Purpose & Payment */}
                    <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <Fieldset>
                            <Legend>Purpose</Legend>
                            <Text>Purpose of guest visit.</Text>
                            <CheckboxGroup>
                                <CheckboxField>
                                    <Checkbox name="purpose_tourist" />
                                    <Label>Tourism</Label>
                                </CheckboxField>
                                <CheckboxField>
                                    <Checkbox name="purpose_conference" />
                                    <Label>Conference</Label>
                                </CheckboxField>
                                <CheckboxField>
                                    <Checkbox name="purpose_group" />
                                    <Label>Group</Label>
                                </CheckboxField>
                                <CheckboxField>
                                    <Checkbox name="purpose_business" />
                                    <Label>Business</Label>
                                </CheckboxField>
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

                    <Divider className="my-5" soft />

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Button type="reset" plain>Reset</Button>
                        <Button type="submit" disabled={isSubmitting || loading}>
                            {loading ? 'Submitting...' : isEditMode ? 'Update Guest' : 'Create Guest'}
                        </Button>
                    </div>
                </form>
            )}
        </Formik>
    )
}
