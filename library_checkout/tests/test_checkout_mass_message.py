from odoo import exceptions
from odoo.tests import common

class TestWizard(common.SingleTransactionCase):
    def setUp(self, *args, **kwargs):
        super(TestWizard).setUp(*args, **kwargs)
        #setup test data
        admin_user = self.env.ref('base.user_admin')
        self.Checkout = self.env['library.checkout']\
            .with_user(admin_user)
        self.Wizard = self.env['library.checkout.massmessage']\
            .with_user(admin_user)
        a_member = self.env['library.member']\
            .create({
                'partner_id': admin_user.partner_id.id
            })
        self.checkout0 = self.Checkout\
            .create({
                'member_id':a_member.id
            })

    def test_01_button_send(self):
        """
            Send button should create messages on Checkouts
        """
        #count message before wizard
        count_before = len(self.checkout0.message_ids)
        #run wizard
        Wizard0 = self.Wizard\
            .with_context(active_ids=self.checkout0._ids)
        wizard0 = Wizard0.create({
            "message_subject" : "Hello",
            "message_body": "This is a message"
        })
        wizard0.button_send()
        #count message after wizard
        count_after = len(self.checkout0.message_ids)
        self.assertEqual(
        count_before+1,
        count_after,
        "Expected one additional message in the checkout")

    def test_02_button_send_empty(self):
        """
            Send button errors on empty message
        """
        Wizard0 = self.Wizard\
            .with_context(active_ids=self.checkout0._ids)
        wizard0 = Wizard0.create({})
        with self.assertRaises(exceptions.UserError) as e:
            wizard0.button_send()
