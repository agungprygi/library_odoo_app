from odoo import models, fields, api

class Book(models.Model):
    _inherit = "library.book"


    is_available = fields.Boolean(string="Is Available?")
    isbn = fields.Char(help="Use a valid ISBN-13 or ISBN-10.")
    publisher_id = fields.Many2one(index=True)

    
    @api.depends('isbn')
    def _check_isbn(self):
        self.ensure_one()
        digits = [int(x) for x in self.isbn if x.isdigit()]
        if len(digits) == 10:
            ponderators = [*range(1, 10)]
            total = sum(a*b for a, b in zip(digits[:9], ponderators))
            check = total%11
            return digits[-1] == check
        else:   
            return super()._check_isbn()
    