import { Link } from '@inertiajs/react';
import { BookOpen, FileText, Globe, LayoutGrid, Tags } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Editorial CMS',
        href: '/cms',
        icon: LayoutGrid,
    },
    {
        title: 'Articles Queue',
        href: '/cms/articles',
        icon: FileText,
    },
    {
        title: 'Taxonomy Desks',
        href: '/cms/taxonomy',
        icon: Tags,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'View Live Portal',
        href: '/',
        icon: Globe,
    },
    {
        title: 'RSS Feed',
        href: '/feed',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/cms" prefetch>
                                <AppLogo />
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
