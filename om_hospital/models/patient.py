from odoo import api, fields, models


class Patient(models.Model):
    _name = "hospital.patient"
    _description = "Hospital Patient"

    name = fields.Char(string="Name")
    age = fields.Integer(string="Age")
    gender = fields.Selection(
        [('male', 'Male'), ('female', 'Female'), ('other', 'Other')], string="Gender"
    )
