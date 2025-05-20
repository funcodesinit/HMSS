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
import { fetchGuests } from '@/store/actions/userActions'

export default function CustomerListComp() {

  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchGuests()).then(() => setLoading(false));
  }, [dispatch])

  const guests = useSelector((state: RootState) => state.user.guests);

  if (Loading) return <LoadingComp />

  return <>
    <div className="flex items-end justify-between gap-4">
      <Heading>Guests</Heading>
      <Link href={'/frontdesk/guests/action'} className="flex items-center gap-2 ">
        <Button className="-my-0.5 cursor-pointer">Create New Guest</Button>
      </Link>
    </div>
    <Table className="mt-8 [--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
      <TableHead>
        <TableRow>
          <TableHeader>Guest Id</TableHeader>
          <TableHeader>Names</TableHeader>
          <TableHeader>Email</TableHeader>
          <TableHeader >Phone</TableHeader>
          <TableHeader >Active</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {!guests || guests.length < 1 || !guests.length ? (
          <TableRow className="h-24 text-start" colSpan={5}>
            <TableCell className='text-lg text-pink-500 flex items-center flex-row gap-2'><span>No Guests  found</span> <NoSymbolIcon className='size-4' /></TableCell>
          </TableRow>) : null
        }
        {guests.length && guests.map((user) => (
          <TableRow key={user?.id} href={`/business/customers/${user?.id}`} title={`Order #${user?.id}`}>
            <TableCell>{user?.id}</TableCell>
            <TableCell className="text-zinc-500">{user?.firstName} {user?.lastName}</TableCell>
            <TableCell>{user?.email}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {/* <Avatar src={user?.event.thumbUrl} className="size-6" /> */}
                <span>{user?.role}</span>
              </div>
            </TableCell>
            <TableCell>{user?.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </>

}

