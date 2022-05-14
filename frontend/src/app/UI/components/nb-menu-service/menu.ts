import { NbMenuItem } from '@nebular/theme';


export const MENU_ITEMS_USER: NbMenuItem[] = [

  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',

  },
  {
    title: 'Scans',
    icon: 'eye-outline',
    link: '/pages/scans',

  },
  {
    title: 'Domains',
    icon: 'globe-2-outline',
    link: '/pages/domains',

  },
  {
    title: 'Vulnerabilities',
    icon: 'shield-outline',
    link: '/pages/vulnerabilities',

  },
  {
    title: 'Leaks',
    icon: 'droplet-outline',
    link: '/pages/leaks',

  },
  {
    title: 'Engines',
    icon: 'layers-outline',
    link: '/pages/engines',

  },
  {
    title: 'Programs & scopes',
    icon: 'browser-outline',
    link: '/pages/programs',

  },
  {
    title: 'Server management',
    icon: 'hard-drive-outline',
    link: '/pages/servers',

  },
  {
    title: 'Tools',
    group: true,
  },
  {
    title: 'Nuclei template',
    icon: 'flash-outline',
    link: '/pages/nuclei',

  },
]



export const MENU_ITEMS_ADMIN: NbMenuItem[] = [
...MENU_ITEMS_USER,




  {
    title: 'Tools settings',
    link: '/admin/tools/settings',
    icon: 'file-outline',
    data: {
      permission: 'admin',
    }
  },
  {
    title: 'Other',
    group: true,
  },

  {
    title: 'Bugbounty platform',
    icon: 'cube-outline',
    children: [
      {
        title: 'Settings',
        link: '/admin/platform/settings',
        icon: 'settings-2-outline',

      },
      {
        title: 'Statistics',
        link: '/admin/platform/stat',
        icon:'bar-chart-outline'
      },
      {
        title: 'Intigriti invoices',
        link: '/admin/platform/intigriti/invoices',
        icon:'file-text-outline'
      },

    ],
  },
  {
    title: 'Settings',
    icon: 'settings-outline',
    children: [
      {
        title: 'Meshs management',
        link: '/admin/meshs',
        icon: 'link-outline',
      },
      {
        title: 'Cloud settings',
        icon: 'globe-outline',
        link: '/admin/cloud/settings',
      },
      {
        title: 'Users management',
        icon: 'people-outline',
        link: '/admin/users',
      },
    ]
  },
];
