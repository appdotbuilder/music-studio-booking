import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Building2, Calendar, CreditCard, Folder, LayoutGrid } from 'lucide-react';

// Dynamic navigation based on user role
const getMainNavItems = (userRole?: string): NavItem[] => {
    const commonItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Studios',
            href: '/studios',
            icon: Building2,
        },
        {
            title: 'My Bookings',
            href: '/bookings',
            icon: Calendar,
        },
    ];

    if (userRole === 'admin') {
        return [
            ...commonItems,
            {
                title: 'Payments',
                href: '/payments',
                icon: CreditCard,
            },
        ];
    }

    return commonItems;
};

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    const mainNavItems = getMainNavItems(auth.user?.role);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-purple-600 text-sidebar-primary-foreground text-lg">
                                    🎵
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">StudioBook</span>
                                    <span className="truncate text-xs">Music Studio Booking</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
