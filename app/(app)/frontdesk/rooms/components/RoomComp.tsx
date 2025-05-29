'use client'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'


import { Field, Label } from '@/components/fieldset'
import React, { useEffect, useState } from 'react'
import { Select } from '@/components/select'
import { Divider } from '@/components/divider'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FormikInput from '@/components/app/FormikField'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRooms } from '@/store/actions/roomActions'
import { RootState } from '@/store'
import LoadingComp from '../../Loading'
import StatusBadge from './StatusBadge'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/input'

 
 
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function RoomComp() {

  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState(null);
  const dispatch = useDispatch();


  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');


 
  useEffect(() => {
    const filters = { 
      "search": search, 
      "status": filterStatus, 
      "type": filterType, 
      "page": 1, 
      "limit": 20 
    };
    dispatch(fetchRooms(filters)).then(() => setLoading(false));
  }, [search, filterStatus, filterType, isOpen]);


  const rooms = useSelector((state: RootState) => state.room.rooms);

  if (!rooms) return <LoadingComp />
  if (loading) return <LoadingComp />;

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Heading>Rooms</Heading>
        <Button type="button" onClick={() => setIsOpen(true)}>
          Add new room
        </Button>
        <Dialog open={isOpen} onClose={setIsOpen}>
          <Formik
            initialValues={{
              id: room?.id || '',
              number: room?.number || '',
              RoomType: room?.type || 'STANDARD',
              status: room?.status || 'AVAILABLE',
              pricePerNight: room?.pricePerNight || '',
            }}
            validationSchema={
              Yup.object({
                number: Yup.string().required("Room number is required."),
                RoomType: Yup.string().required("room type is required."),
                pricePerNight: Yup.string().required("Price per night is required."),
                status: Yup.string().required("status is required."),
              })
            }
            enableReinitialize={true}
            onSubmit={async (values, { setStatus }) => {
              setLoading(true);
              setStatus(null); // Clear any previous status message

              const method = room?.id ? 'PATCH' : 'POST';

              const url = 'rooms/api';

              const body = {
                id: room?.id,
                number: values.number,
                type: values.RoomType,
                pricePerNight: values.pricePerNight,
                status: values.status,
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

                if (!response.ok) {
                  // Handle backend validation or server error
                  const errorMessage = data?.message || 'Failed to create room.';
                  setStatus(errorMessage);
                } else {
                  setIsOpen(false);
                }
              } catch (error) {
                setStatus('Something went wrong while creating the room. Please try again.');
                console.error('Error:', error);
              } finally {
                setRoom(null);
                setLoading(false);

              }
            }}

          >
            {({
              handleSubmit, isSubmitting, errors, handleChange, status, setStatus, values
            }) => (
              <form method="post" onSubmit={handleSubmit}>
                <DialogTitle> {room?.id ? `Update Room No. ${room.number}` : 'Create new room'}</DialogTitle>
                <DialogDescription>
                  Fill in the form to  {room?.id ? `update Room No. ${room.number}` : 'create new room'}
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

                  <FormikInput label={'Room Number'} name="number" placeholder="i.e 2, 3, 4 ..." />
                  <Divider className='my-5' />

                  <Field>
                    <Label>Room Type</Label>
                    <Select name="RoomType" onChange={handleChange} value={values.RoomType} >
                      <option value="STANDARD">Standard</option>
                      <option value="A_FRAMES">A Frames</option>
                      <option value="FLOATING">Floating</option>
                      <option value="EXECUTIVE">Executive</option>
                    </Select>
                  </Field>
                  <Divider className='my-5' />

                  <Field>
                    <Label>Room Status</Label>
                    <Select name="status" onChange={handleChange} value={values?.status}>
                      <option value="AVAILABLE">Available</option>
                      <option value="OCCUPIED">Occupied</option>
                      <option value="RESERVED">Reserved</option>
                      <option value="MAINTENANCE">Maintenance</option>
                    </Select>
                  </Field>

                  <Divider className='my-5' />


                  <FormikInput label={'Price Per Night'} name="pricePerNight" placeholder="$0.00" />



                </DialogBody>
                <DialogActions>
                  <Button plain onClick={() => {
                    setIsOpen(false);
                    setRoom(null);
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
      <Divider className="my-5" />
      <div className="flex gap-4 items-center my-4">
        <Input
          type="text"
          placeholder="Search room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="STANDARD">Standard</option>
          <option value="A_FRAMES">A Frames</option>
          <option value="FLOATING">Floating</option>
          <option value="EXECUTIVE">Executive</option>
        </Select>

        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="OCCUPIED">Occupied</option>
          <option value="RESERVED">Reserved</option>
          <option value="MAINTENANCE">Maintenance</option>
        </Select>
      </div>

      <ul role="list" className="grid grid-cols-1 gap-x-6 mt-10 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
        {rooms?.error && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {rooms?.error}
          </div>
        )}
        {rooms?.data && !rooms?.data?.length && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            No rooms found.
          </div>
        )}
        {rooms?.data?.map((client) => (
          <li key={client.id} className="overflow-hidden rounded-xl border border-gray-200">
            <div className="flex items-center  justify-between gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
              <div className="text-sm/6 font-bold text-gray-900 ">Room No. {client.number}</div>
              <span onClick={() => {
                setRoom(client);
                setIsOpen(true)
              }}>
                <PencilSquareIcon className='size-5' />
              </span>

            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm/6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Price/Night</dt>
                <dd className="text-gray-700">
                  <div className="font-medium text-gray-900">BWP {client.pricePerNight}</div>
                </dd> 
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Room type</dt>
                <dd className="text-gray-700">
                  <div className="font-medium text-gray-900">{client.type}</div>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Status</dt>
                <dd className="flex items-start gap-x-2">
                  <StatusBadge status={client.status} />
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  )
}
