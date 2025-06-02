'use client'
import { Subheading } from '@/components/heading'
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
import { fetchBills, fetchPos } from '@/store/actions/paymentAction'
import { fetchReservations } from '@/store/actions/roomActions'

export default function BillingComp() {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [bill, setBill] = useState(null);

    useEffect(() => {
        dispatch(fetchBills()).then(() => setLoading(false));
    }, [dispatch]);

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
                            reservationId: bill?.reservationId || '',
                            amount: bill?.amount || '',
                            paid: bill?.paid || false,
                        }}
                        validationSchema={
                            Yup.object({
                                reservationId: Yup.string().required("reservation room is required."),
                                amount: Yup.string().required("amount is required."),
                                paid: Yup.boolean(),
                            })
                        }

                        enableReinitialize={true}
                        onSubmit={async (values, { setStatus, resetForm }) => {
                            setLoading(true);
                            setStatus(null);
                            const url = bill?.id ? `/frontdesk/billing/${bill?.id}/api` : '/frontdesk/billing/api';
                            const method = bill?.id ? 'PUT' : 'POST';
                            try {
                                const response = await fetch(url, {
                                    method: method,
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        reservationId: values.reservationId,
                                        amount: parseFloat(values.amount),
                                        paid: values.paid,
                                    }),
                                });

                                const data = await response.json();

                                if (!response.ok) {
                                    const errorMessage = data?.message || 'Failed to create POS item.';
                                    setStatus(errorMessage);
                                } else {
                                    setIsOpen(false);
                                    resetForm();
                                    // Optionally reset form state or refresh list
                                    dispatch(fetchBills());

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
                                    Fill in the form to  {bill?.id ? `update Bill No. ${bill.id}` : 'create Bill'}
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
                                        <Select name="reservationId" onChange={handleChange} value={values.reservationId}>
                                            {/* Replace these options with actual guests dynamically */}
                                            <option value="">Select Reservation</option>
                                            {reservations?.data?.map((g) => (
                                                <option key={g.id} value={g.id}>
                                                    Room {g.room.number} - {g.guest.firstName} {g.guest.lastName}
                                                </option>

                                            ))}
                                        </Select>
                                    </Field>
                                    <Divider className="my-4" />
                                    <FormikInput label="Amount" name="amount" placeholder="Optional description" />
                                    <Divider className="my-4" />
                                    <Field className='gap-2 flex items-center'>
                                        <Label htmlFor="paid">Paid</Label>
                                        <input
                                            id="paid"
                                            name="paid"
                                            type="checkbox"
                                            onChange={handleChange}
                                            checked={values.paid}
                                            className="form-checkbox"
                                        />
                                    </Field>




                                </DialogBody>
                                <DialogActions>
                                    <Button plain onClick={() => {
                                        setIsOpen(false);
                                        setBill(null);
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
                        <TableHeader>Billinng Id</TableHeader>
                        <TableHeader>room</TableHeader>
                        <TableHeader>Guest</TableHeader>
                        <TableHeader>Paid</TableHeader>
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
                    {Array.isArray(bills) && bills.length === 0 && (

                        <TableRow  >
                            <TableCell colSpan={5} className="text-pink-500 flex items-center gap-2">
                                <div className='text-sm text-red-700'>
                                    No reservations found.
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                    {bills?.map((order) => (
                        <TableRow key={order?.id} title={`Order #${order.id}`}>
                            <TableCell>{order?.id}</TableCell>
                            <TableCell className="text-zinc-500">{order?.reservation?.room?.number}</TableCell>
                            <TableCell>{order?.reservation?.guest?.firstName} {order?.reservation?.guest?.lastName}</TableCell>
                            <TableCell>{order.paid ? 'paid' : 'not paid'}</TableCell>
                            <TableCell className="text-right">BPW {order.amount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );

}
