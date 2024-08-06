from odoo import fields, models, api, exceptions

class CheckoutMassMessage(models.TransientModel):
    _name = "library.checkout.massmessage"
    _description = "Send message to Borrowers"

    checkout_ids = fields.Many2many("library.checkout", string="Checkout")
    message_subject = fields.Char()
    message_body = fields.Html()