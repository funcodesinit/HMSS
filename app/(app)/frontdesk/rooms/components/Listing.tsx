import { Subheading } from '@/components/heading'
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import React from 'react'
import StatusBadge from './StatusBadge';
import { RoomType } from '../../types/rooms';

 

interface ListingCompProps {
  title: string;
  rooms: {
    data?: RoomType[];
    error?: string;
  };
  setRoom: (room: RoomType) => void;
  setIsOpen: (open: boolean) => void;
}


export default function ListingComp({ title, rooms, setRoom, setIsOpen }: ListingCompProps) {
    // This component is used to display a listing of rooms with a title
    return (
        <div>
            <Subheading className='mb-4'>{title === 'A_FRAMES' ? 'A Frame' : title}</Subheading>
            <ul role="list" className="grid  grid-cols-1 gap-x-6 mb-10 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
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
                {rooms?.data
                    ?.filter(client => client.type === title.toLocaleUpperCase())
                    .map(client => (
                        <li key={client.id} className="overflow-hidden rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                                <div className="text-sm/6 font-bold text-gray-900">Room No. {client.number}</div>
                                <span
                                    onClick={() => {
                                        setRoom(client);
                                        setIsOpen(true);
                                    }}
                                >
                                    <PencilSquareIcon className="size-5" />
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
        </div>
    )
}