# -*- coding: utf-8 -*-
{
    'name': "library_dashboard",
    'summary': "Library Dashboard",
    'category': 'Administration',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base', 'library_app'],

    # always loaded
    'data': [
        'views/library_dashboard_menu.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'library_dashboard/static/src/js/library_dashboard.js',
            'library_dashboard/static/src/xml/library_dashboard.xml',
            'https://cdn.jsdelivr.net/npm/chart.js',
        ],
    },
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': False,  
    'application': False,
}

