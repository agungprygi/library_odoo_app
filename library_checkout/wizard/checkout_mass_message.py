import logging
from odoo import fields, models, api, exceptions

_logger = logging.getLogger(__name__)

class CheckoutMassMessage(models.TransientModel):
    _name = "library.checkout.massmessage"
    _description = "Send message to Borrowers"

    checkout_ids = fields.Many2many("library.checkout", string="Checkout")
    message_subject = fields.Char()
    message_body = fields.Html()

    @api.model
    def default_get(self, fields):
        default_dict = super(CheckoutMassMessage, self).default_get(fields)
        # add values to the default_dict here
        checkout_ids = self.env.context["active_ids"]
        default_dict["checkout_ids"] = [(6, 0, checkout_ids)]
        return default_dict

    def button_send(self):
        self.ensure_one()
        
        if not self.checkout_ids:
          raise exceptions.UserError("No Checkouts were selected.")
        
        if not self.message_body:
          raise exceptions.UserError("A message body is required")

        for checkout in self.checkout_ids:
            checkout.message_post(
                body=self.message_body,
                subject=self.message_subject,
                subtype='mail.mt_comment'
            )
            _logger.debug(
              "Message on %d to follower: %s",
              checkout.id,
              checkout.message_follower_ids
            )
        _logger.info(
          "Posted %d messages to the Checkouts: %s",
          len(self.checkout_ids),
          str(self.checkout_ids)
        )
        return True
