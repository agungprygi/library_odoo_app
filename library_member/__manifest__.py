{
    'name': "Library Member",
    'license' : "AGPL-3",
    'description': "Manager members borrowing books.",
    'author': "Agung Prayogi",
    'depends' : ["library_app", "mail"],
    'data' : [
        'security/ir.model.access.csv',
        'security/library_security.xml',
        'views/book_view.xml',
        'views/library_menu.xml',
        'views/member_view.xml',
        'views/book_list_template.xml'
    ],
    'application' : False,
}

