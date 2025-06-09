'use client'
import { Avatar } from '@/components/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/16/solid'
import {
  ClipboardDocumentIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  HomeIcon,
  InboxIcon,
  InboxStackIcon,
  MagnifyingGlassIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  ShoppingCartIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
} from '@heroicons/react/20/solid'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'


export default function ApplicationLayout({ children }: { children: React.ReactNode }) {
  let pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user as {
    id: any;
    email?: string;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    avatar?: string;
  };


  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href="/search" aria-label="Search">
              <MagnifyingGlassIcon />
            </NavbarItem>
            <NavbarItem href="/inbox" aria-label="Inbox">
              <InboxIcon />
            </NavbarItem>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src="/profile-photo.jpg" square />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="bottom end">
                <DropdownItem href="/my-profile">
                  <UserIcon />
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/privacy-policy">
                  <ShieldCheckIcon />
                  <DropdownLabel>Privacy policy</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/share-feedback">
                  <LightBulbIcon />
                  <DropdownLabel>Share feedback</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/logout">
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Image src="/logo.png" alt='logo' width={100} height="100" className='mb-3 tint-red-900' />
            <SidebarSection className="max-lg:hidden">
              {/* <SidebarItem href="/search">
                <MagnifyingGlassIcon />
                <SidebarLabel>Search</SidebarLabel>
              </SidebarItem> */}
              <SidebarItem href="/frontdesk/staff" current={pathname === '/frontdesk/staff'}>
                <InboxIcon />
                <SidebarLabel>Staff Users</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>

              <SidebarItem href="/frontdesk/guests" current={pathname === '/frontdesk/guests'}>
                <UserIcon />
                <SidebarLabel>Guests</SidebarLabel>
              </SidebarItem>

              <SidebarItem href="/frontdesk/rooms" current={pathname === '/frontdesk/rooms'}>
                <TicketIcon />
                <SidebarLabel>Rooms</SidebarLabel>
              </SidebarItem>

              <SidebarItem href="/frontdesk/reservations" current={pathname === '/frontdesk/reservations'}>
                <ClipboardDocumentIcon />
                <SidebarLabel>Reservations</SidebarLabel>
              </SidebarItem>

              <SidebarItem href="/frontdesk/products" current={pathname === '/frontdesk/products'}>
                <ShoppingCartIcon />
                <SidebarLabel>Menu Items</SidebarLabel>
              </SidebarItem>

              <SidebarItem href="/frontdesk/sales" current={pathname === '/frontdesk/sales'}>
                <InboxStackIcon />
                <SidebarLabel>POS Transactions</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/frontdesk/orders" current={pathname === '/frontdesk/orders'}>
                <InboxStackIcon />
                <SidebarLabel>Orders</SidebarLabel>
              </SidebarItem>

              <SidebarItem href="/frontdesk/billing" current={pathname === '/frontdesk/billing'}>
                <CreditCardIcon />
                <SidebarLabel>Billing</SidebarLabel>
              </SidebarItem>

            </SidebarSection>
            {/* <SidebarSection className="max-lg:hidden">
              <SidebarHeading>Quick Reports</SidebarHeading>
              <SidebarItem href="/events/1">Today's Sales</SidebarItem>
              <SidebarItem href="/events/2">Stock Level</SidebarItem>
              <SidebarItem href="/events/3">Weekly Sales</SidebarItem>
              <SidebarItem href="/events/4">Trending Products</SidebarItem>
            </SidebarSection>
             */}
            <SidebarSpacer />
            <SidebarSection>
              <SidebarItem href="/support">
                <QuestionMarkCircleIcon />
                <SidebarLabel>Support</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/changelog">
                <SparklesIcon />
                <SidebarLabel>Changelog</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <span className="min-w-0">
                    //add firstName and lastName to user object
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {user?.email || 'looading...'}
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="top start">
                {/* <DropdownItem href="/my-profile">
                  <UserIcon />
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>
               
                <DropdownDivider />
                <DropdownItem href="/privacy-policy">
                  <ShieldCheckIcon />
                  <DropdownLabel>Privacy policy</DropdownLabel>
                </DropdownItem> */}

                <DropdownDivider />
                <DropdownItem href="/api/auth/signout">
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>Sign out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}