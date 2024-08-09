# -*- coding: utf-8 -*-
{
    'name': "Library Management",
    'summary': 'Manage library catalog and book lending.',
    'author': 'Agung Prayogi',
    'category': 'Services/Library',
    'license' : 'AGPL-3',
    'website' : 'https://github.com/PacktPublishing/odoo-17-Development-Essentials',
    'depends': ['base', 'web'],

    # always loaded
    'data': [
        'security/ir.model.access.csv',
        'security/library_security.xml',
        'views/library_menu.xml',
        'views/book_view.xml',
        'views/book_list_template.xml',
        "reports/library_book_report.xml",
        "reports/library_publisher_report.xml"
    ],
    # only loaded in demonstration mode
    'demo': [
        'data/res.partner.csv',
        'data/library.book.csv',
        'data/book_demo.xml'
    ],
}

