 
'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Input } from '@/components/input'
import LoadingComp from '../../Loading'
import { fetchReservations } from '@/store/actions/roomActions'
import { RootState } from '@/store'
import { NoSymbolIcon } from '@heroicons/react/24/outline'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/table'
import { Select } from '@/components/select'

export default function ReserveComp() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const limit = 10

  // Filters
  const [guest, setGuest] = useState('')
  const [room, setRoom] = useState('')
  const [status, setStatus] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Fetch reservations
  useEffect(() => {
    const filters = {
      page,
      limit,
      guest,
      room,
      status,
      startDate,
      endDate
    }

    dispatch(fetchReservations(filters) as any).finally(() => setLoading(false))
  }, [dispatch, page, guest, room, status, startDate, endDate])

  const reservations = useSelector((state: RootState) => state.room.reservations)
  const totalRes = reservations?.pagination?.total || 0
  const totalPages = Math.ceil(totalRes / limit)

  const handleClearFilters = () => {
    setGuest('')
    setRoom('')
    setStatus('')
    setStartDate('')
    setEndDate('')
    setPage(1)
  }

  if (loading) return <LoadingComp />

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Heading>Reservation</Heading>
        <Link href="/frontdesk/reservations/action" className="flex items-center gap-2">
          <Button>Add New Reservation</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-6">
        <Input
          placeholder="Guest name/email"
          value={guest}
          onChange={(e) => {
            setGuest(e.target.value)
            setPage(1)
          }}
        />
        <Input
          placeholder="Room number"
          value={room}
          onChange={(e) => {
            setRoom(e.target.value)
            setPage(1)
          }}
        />
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CHECKED_IN">Checked In</option>
          <option value="CHECKED_OUT">Checked Out</option>
          <option value="CANCELLED">Cancelled</option>
        </Select>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value)
            setPage(1)
          }}
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value)
            setPage(1)
          }}
        />
        <Button size="sm" variant="outline" onClick={handleClearFilters}>
          Clear
        </Button>
      </div>

      {/* Table */}
      <Table className="mt-8">
        <TableHead>
          <TableRow>
            <TableHeader>Guest</TableHeader>
            <TableHeader>Room No.</TableHeader>
            <TableHeader>Check-in</TableHeader>
            <TableHeader>Check-out</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!reservations?.data || reservations.data.length === 0) ? (
            <TableRow>
              <TableCell colSpan={6} className="text-pink-500 flex items-center gap-2">
                No reservations found <NoSymbolIcon className="size-4" />
              </TableCell>
            </TableRow>
          ) : (
            reservations.data.map((item) => (
              <TableRow key={item.id} href={`/frontdesk/reservations/${item.id}`}>
                <TableCell>{item.guest?.firstName} {item.guest?.lastName}</TableCell>
                <TableCell>{item.room?.number}</TableCell>
                <TableCell>{new Date(item.checkInDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(item.checkOutDate).toLocaleDateString()}</TableCell>
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Previous
            </Button>
            <Button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
