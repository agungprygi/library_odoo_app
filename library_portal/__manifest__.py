{
    'name' : "Library Portal",
    'description': "Portal for Library Members",
    'author': "Danies Reis",
    'license': "AGPL-3",
    'depends': ['library_checkout', 'portal', 'web'],
    'data': [
        "security/library_security.xml",
        "security/ir.model.access.csv",
        "views/main_templates.xml",
        "views/portal_templates.xml"
    ],
    'assets' :{
        "web.assets_backend" : {
            "library_portal/static/src/css/library.css"
        }
    }
}