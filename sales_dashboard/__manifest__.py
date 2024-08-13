# -*- coding: utf-8 -*-
###############################################################################
#
#    Cybrosys Technologies Pvt. Ltd.
#
#    Copyright (C) 2023-TODAY Cybrosys Technologies(<https://www.cybrosys.com>)
#    Author: Aysha Shalin (odoo@cybrosys.com)
#
#    You can modify it under the terms of the GNU LESSER
#    GENERAL PUBLIC LICENSE (LGPL v3), Version 3.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU LESSER GENERAL PUBLIC LICENSE (LGPL v3) for more details.
#
#    You should have received a copy of the GNU LESSER GENERAL PUBLIC LICENSE
#    (LGPL v3) along with this program.
#    If not, see <http://www.gnu.org/licenses/>.
#
###############################################################################
{
    'name': 'Sales Custom Dashboard',
    'version': '17.0.1.0.0',
    'category': 'Sales',
    'summary': 'Detailed dashboard view for Inventory module.',
    'description': """This module presents a detailed dashboard view for the
    Inventory module, delivering a compr    ehensive and concise overview that
    serves as a valuable tool for both inventory users and administrators.""",
    'author': 'Cybrosys Techno Solutions',
    'company': 'Cybrosys Techno Solutions',
    'maintainer': 'Cybrosys Techno Solutions',
    'website': "https://www.cybrosys.com",
    'depends': ['sale', 'base'],
    'data': [
        'views/dashboard_menu.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&amp;display=swap',
            # 'inventory_stock_dashboard_odoo/static/src/css/dashboard.css',
            'sales_dashboard/static/src/js/*.js',
            'sales_dashboard/static/src/xml/*.xml',
            'https://cdn.jsdelivr.net/npm/chart.js',
        ],
    },
    'images': ['static/description/banner.png'],
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': False,  
    'application': False,
}
