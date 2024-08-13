# -*- coding: utf-8 -*-
# from odoo import http


# class SaleNote(http.Controller):
#     @http.route('/sale_note/sale_note', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/sale_note/sale_note/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('sale_note.listing', {
#             'root': '/sale_note/sale_note',
#             'objects': http.request.env['sale_note.sale_note'].search([]),
#         })

#     @http.route('/sale_note/sale_note/objects/<model("sale_note.sale_note"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('sale_note.object', {
#             'object': obj
#         })

