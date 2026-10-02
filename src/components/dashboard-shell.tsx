'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  ChevronsUpDown,
  CreditCard,
  FileText,
  FolderKanban,
  Github,
  LayoutDashboard,
  UserRound,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const organizations = [
  {
    name: 'Personal workspace',
    projects: [
      {
        name: 'Starter app',
        description: 'A starting point for your next idea.',
      },
      { name: 'Customer portal', description: 'A home for your customers.' },
    ],
  },
  {
    name: 'Example team',
    projects: [
      {
        name: 'Team workspace',
        description: 'A shared place to build together.',
      },
      {
        name: 'Internal tools',
        description: 'Simple tools for everyday work.',
      },
    ],
  },
];
const PreviewOrganization = createContext(organizations[0]);

function WorkspaceSidebar({
  email,
  organization,
  selectOrganization,
}: {
  email: string;
  organization: string;
  selectOrganization: (name: string) => void;
}) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const closeMobile = () => setOpenMobile(false);
  const groups = [
    {
      label: 'Workspace',
      items: [
        { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Projects', href: '/dashboard#projects', icon: FolderKanban },
        { label: 'Account', href: '/account', icon: UserRound },
        { label: 'Billing', href: '/account#subscription', icon: CreditCard },
      ],
    },
    {
      label: 'Resources',
      items: [
        { label: 'Documentation', href: '/docs', icon: BookOpen },
        { label: 'Blog', href: '/blog', icon: FileText },
        {
          label: 'Source code',
          href: 'https://github.com/coremvp/hikari',
          icon: Github,
        },
      ],
    },
  ];
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="gap-4 px-4 pb-4 pt-5">
        <Link
          href="/"
          aria-label="Hikari home"
          className="inline-flex items-center gap-2 font-semibold tracking-tight"
        >
          <Logo />
        </Link>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  aria-label={`Organization preview: ${organization}`}
                >
                  <Building2 />
                  <span className="grid min-w-0 flex-1 gap-0.5">
                    <span className="truncate font-medium">{organization}</span>
                    <span className="text-xs text-muted-foreground">
                      Organization preview
                    </span>
                  </span>
                  <ChevronsUpDown />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? 'bottom' : 'right'}
                align="start"
                className="w-64 max-w-[calc(100vw-2rem)]"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Example organizations</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={organization}
                    onValueChange={(name) => {
                      selectOrganization(name);
                      if (isMobile) closeMobile();
                    }}
                  >
                    {organizations.map((item) => (
                      <DropdownMenuRadioItem key={item.name} value={item.name}>
                        {item.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <p className="px-2 py-1.5 text-xs leading-relaxed text-muted-foreground">
                  Visual preview only. Organizations are not saved.
                </p>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <nav aria-label="Workspace navigation">
          {groups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const active =
                      !item.href.includes('#') && pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={active}>
                          <Link
                            href={item.href}
                            onClick={closeMobile}
                            aria-current={active ? 'page' : undefined}
                          >
                            <item.icon />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>
      <SidebarFooter className="gap-3 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/account" onClick={closeMobile}>
                <Avatar>
                  <AvatarFallback>
                    {email.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="grid gap-0.5">
                  <span>My account</span>
                  <span className="text-xs text-muted-foreground">
                    Account and billing
                  </span>
                </span>
                <ArrowUpRight className="ml-auto" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <p className="px-2 text-xs text-muted-foreground">
          <a href="https://coremvp.com">CoreMVP</a> · MIT open source
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}

export function DashboardShell({
  children,
  email,
}: {
  children: ReactNode;
  email: string;
}) {
  const pathname = usePathname();
  const [organizationName, setOrganizationName] = useState(
    organizations[0].name,
  );
  const organization =
    organizations.find((item) => item.name === organizationName) ??
    organizations[0];
  return (
    <PreviewOrganization.Provider value={organization}>
      <SidebarProvider className="hikari-dashboard bg-sidebar text-foreground [&_[data-slot=card]]:rounded-sm [&_[data-slot=card]]:shadow-none">
        <WorkspaceSidebar
          email={email}
          organization={organization.name}
          selectOrganization={setOrganizationName}
        />
        <SidebarInset className="min-w-0">
          <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4 md:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-4" />
              <p className="text-sm font-medium">
                {pathname === '/account' ? 'Account' : 'Overview'}
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/docs">
                Docs <ArrowUpRight data-icon="inline-end" />
              </Link>
            </Button>
          </header>
          <div className="flex flex-1 flex-col bg-muted/20">
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 md:px-8">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </PreviewOrganization.Provider>
  );
}

export function DashboardProjects() {
  const organization = useContext(PreviewOrganization);
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="scroll-mt-6"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 id="projects-title" className="text-lg font-semibold">
            Projects
          </h2>
          <p className="text-sm text-muted-foreground">
            Example projects in {organization.name.toLowerCase()}.
          </p>
        </div>
        <Badge variant="outline">UI preview</Badge>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {organization.projects.map((project) => (
          <Card key={project.name}>
            <CardHeader className="flex flex-row items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-sm border bg-muted/40">
                <FolderKanban className="size-5" aria-hidden="true" />
              </span>
              <div className="flex min-w-0 flex-col gap-2">
                <CardTitle role="heading" aria-level={3}>
                  {project.name}
                </CardTitle>
                <CardDescription>{organization.name}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        Projects and organizations are visual examples. Hikari does not store
        them or manage team membership.
      </p>
    </section>
  );
}
