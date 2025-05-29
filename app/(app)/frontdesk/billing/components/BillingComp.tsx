'use client'
import {  Subheading } from '@/components/heading'
import { Select } from '@/components/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { Button } from '@/components/button'
import { useEffect, useState } from 'react'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { Formik } from 'formik'
import { Field, Label } from '@/components/fieldset'
import * as Yup from 'yup'

import FormikInput from '@/components/app/FormikField'
import { Divider } from '@/components/divider'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import LoadingComp from '../../Loading'
import { useSession } from 'next-auth/react'
import { fetchPos } from '@/store/actions/paymentAction'
import { fetchReservations } from '@/store/actions/roomActions'
import { Checkbox, CheckboxField } from '@/components/checkbox'

export default function BillingComp() {
    const dispatch = useDispatch();
    const { data: session, status } = useSession()

    const user = session?.user;

    //   let orders = await getRecentOrders() 
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [bill, setBill] = useState(null);

    useEffect(() => {
        dispatch(fetchPos()).then(() => setLoading(false));
    }, [dispatch, ]);

    useEffect(() => {
        dispatch(fetchReservations())
    }, [dispatch])

 
    const bills = useSelector((state: RootState) => state.payment.bills);
    const reservations = useSelector((state: RootState) => state.room.reservations);

    if (loading) return <LoadingComp />

    return (
        <>
            <div className="mt-8 flex items-end justify-between">
                <Subheading>Billing</Subheading>
                <Button type="button" onClick={() => setIsOpen(true)}>
                    Add Billing
                </Button>
                <Dialog open={isOpen} onClose={setIsOpen}>
                    <Formik
                        initialValues={{
                            id: bill?.id || '',
                            guestId: bill?.guestId || '',
                            reservationId: bill?.reservationId || '',
                            amount: bill?.amount || '',
                            paid: bill?.paid || false,
                        }}
                        validationSchema={
                            Yup.object({
                                guestId: Yup.string().required("guest is required."),
                                reservationId: Yup.string().required("reservation room is required."),
                                amount: Yup.string().required("amount is required."),
                                paid: Yup.boolean(),
                            })
                        }

                        enableReinitialize={true}
                        onSubmit={async (values, { setStatus }) => {
                            setLoading(true);
                            setStatus(null);
                            const url = bill?.id ? `/frontdesk/sales/${bill?.id}/api` : '/frontdesk//sales/api';
                            const method = bill?.id ? 'PUT' : 'POST';
                            try {
                                const response = await fetch(url, {
                                    method: method,
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        guestId: values.guestId,
                                        reservationId: values.reservationId,
                                        amount: parseFloat(values.amount),
                                        paid: values.paid || '',
                                    }),
                                });

                                const data = await response.json();

                                if (!response.ok) {
                                    const errorMessage = data?.message || 'Failed to create POS item.';
                                    setStatus(errorMessage);
                                } else {
                                    setIsOpen(false);
                                    // Optionally reset form state or refresh list
                                    // dispatch(fetchPos()).then(() => {
                                    //     dispatch(SetPosStats());
                                    // });
                                }
                            } catch (error) {
                                console.error('Error creating POS item:', error);
                                setStatus('Something went wrong while creating the POS item. Please try again.');
                            } finally {
                                setLoading(false);
                                setBill(null);
                            }
                        }}

                    >
                        {({
                            handleSubmit, isSubmitting, errors, handleChange, status, setStatus, values
                        }) => (
                            <form method="post" onSubmit={handleSubmit}>
                                <DialogTitle> {bill?.id ? `Update Room No. ${bill.id}` : 'Add Pos Transaction'}</DialogTitle>
                                <DialogDescription>
                                    Fill in the form to  {bill?.id ? `update Room No. ${pos.id}` : 'create new room'}
                                </DialogDescription>
                                <DialogBody>

                                    {status && (
                                        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                                            {status}
                                        </div>
                                    )}

                                    {Object.keys(errors).length > 0 && (
                                        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-4">
                                            <ul className="list-disc list-inside text-sm text-red-700">
                                                {Object.entries(errors).map(([field, message]) => (
                                                    <li key={field}>{typeof message === 'string' ? message : 'Invalid value'}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}


                                    <Field >
                                        <Label>Reservation</Label>
                                        <Select name="guestId" onChange={handleChange} value={values.guestId}>
                                            {/* Replace these options with actual guests dynamically */}
                                            <option value="">Select Reservation</option>
                                            {reservations?.data?.map((g) => (
                                                <option key={g.id} value={g.id}>
                                                    reservation room {g.room.number }  
                                                </option>
                                            ))}
                                        </Select>
                                    </Field>

                                    <Divider className="my-4" />
                                    <FormikInput label="Guest" name="guestId" displayValue={''} value={values.guestId} placeholder="Optional description" />


                                    <Divider className="my-4" />
                                    <FormikInput label="Amount" name="itemDescription" placeholder="Optional description" />
                                    <Divider className="my-4" />
                                    <CheckboxField>
                                        <Checkbox name="extraBed" />
                                        <Label>Paid</Label>
                                    </CheckboxField>


                                </DialogBody>
                                <DialogActions>
                                    <Button plain onClick={() => {
                                        setIsOpen(false);
                                        setPostxn(null);
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Creating...' : 'Save'}
                                    </Button>
                                </DialogActions>
                            </form>
                        )}
                    </Formik>
                </Dialog>
            </div> 
            <Table className="mt-4 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
                <TableHead>
                    <TableRow>
                        <TableHeader>Transaction Id</TableHeader>
                        <TableHeader>Purchase date</TableHeader>
                        <TableHeader>Guest</TableHeader>
                        <TableHeader>Room</TableHeader>
                        <TableHeader className="text-right">Amount</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bills?.error && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-pink-500 flex items-center gap-2">
                                <div className=' text-sm text-red-700'>

                                    {bills?.error}
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {bills && !bills?.length && (
                        <TableRow  >
                            <TableCell colSpan={5} className="text-pink-500 flex items-center gap-2">
                                <div className='text-sm text-red-700'>
                                    No reservations found.
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {bills?.map((order) => (
                        <TableRow key={order.id} href={order.url} title={`Order #${order.id}`}>
                            <TableCell>{order.id}</TableCell>
                            <TableCell className="text-zinc-500">{order.createdAt}</TableCell>
                            <TableCell>{order.guest.firstName} {order.guest.lastName}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {/* <Avatar src={order.event.thumbUrl} className="size-6" /> */}
                                    <span>{order.itemName}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">BPW {order.amount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );

}
