// Created by kev, 2023-10-05 12:00:00
'use client'

import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { Heading } from '@/components/heading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { RootState } from '@/store'
import { NoSymbolIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingComp from '../../Loading'
import { fetchGuests, fetchUsers } from '@/store/actions/userActions'
import { Input } from '@/components/input'

export default function UserListComp() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const limit = 10

  // Filter states
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  const [company, setCompany] = useState('')

  useEffect(() => {
    setLoading(true)
    dispatch(fetchUsers() as any).finally(() => setLoading(false))
  }, [dispatch ])

  useEffect(() => {
    const filters = { page, limit, search, city, country, company }
    setLoading(true)
    dispatch(fetchUsers(filters) as any).finally(() => setLoading(false))
  }, [page, search, city, country, company])

  const users = useSelector((state: RootState) => state.user.users)
  const totalUsers = useSelector((state: RootState) => state?.user?.users?.pagination?.total)


  const totalPages = Math.ceil(totalUsers / limit)
 

  if (loading) return <LoadingComp />

  return (  
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Heading>Staff Users</Heading>
        <Link href="/frontdesk/guests/action" className="flex items-center gap-2">
          {/* <Button>Create New Guest</Button> */}
        </Link>
      </div>

      {/* Filters */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Input
          placeholder="Search name/email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
        <Input
          placeholder="City"
          value={city}
          onChange={(e) => {
            setCity(e.target.value)
            setPage(1)
          }}
        />
        <Input
          placeholder="Country"
          value={country}
          onChange={(e) => {
            setCountry(e.target.value)
            setPage(1)
          }}
        />
        <Input
          placeholder="Company"
          value={company}
          onChange={(e) => {
            setCompany(e.target.value)
            setPage(1)
          }}
        />
      </div> */}

      {/* Table */}
      <Table className="mt-8">
        <TableHead>
          <TableRow>
            <TableHeader>Staff Name</TableHeader>
            <TableHeader>Email</TableHeader>
            <TableHeader>Phone</TableHeader>
            <TableHeader>Company</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!users.data || users.data.length === 0) ? (
            <TableRow>
              <TableCell colSpan={4} className="text-pink-500 flex items-center gap-2">
                No Guests found <NoSymbolIcon className="size-4" />
              </TableCell>
            </TableRow>
          ) : (
            users?.data?.map((user) => (
              <TableRow key={user?.id} href={`/frontdesk/guests/${user?.id}`}>
                <TableCell>{user?.firstName} {user?.lastName}</TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>{user?.phoneNumber}</TableCell>
                <TableCell>{user?.company}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
