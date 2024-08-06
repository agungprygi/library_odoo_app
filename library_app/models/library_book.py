from odoo import models, fields, api
from odoo.exceptions import ValidationError

class Book(models.Model):
    _name = "library.book"
    _description = "Book"


    #String Fields:
    name = fields.Char(string="Title", required=True)
    isbn = fields.Char(string="ISBN")
    book_type = fields.Selection([("paper", "Paperback"),
                                  ("hard", "HardCover"),
                                  ("electronic", "Electronic"), 
                                  ("other", "Other")], string="Type")
    notes = fields.Text(string="Internal Notes")
    descr = fields.Html(string="Description")

    #Numeric Fields:
    copies = fields.Integer(default=1)
    avg_rating = fields.Float("Average Rating", (3,2))
    price = fields.Monetary(string="Price", currency_field="currency_id")
    #price helper
    currency_id = fields.Many2one("res.currency")

    #date and time fields:
    date_published = fields.Date()
    last_borrow_date = fields.Datetime(string="Last Borrowed On", default=lambda self:fields.Datetime.now())

    #other field
    active = fields.Boolean(string="Active?", default=True)
    image = fields.Binary(string="Cover")

    #relational fields:
    publisher_id = fields.Many2one(comodel_name="res.partner", string="Publisher")
    author_ids = fields.Many2many(comodel_name="res.partner", string="Authors")

    @api.depends("publisher_id.country_id")
    def _compute_publisher_country(self):
        for book in self:
            book.publisher_country_id = book.publisher_id.country_id
    
    def _inverse_publisher_country(self):
        for book in self:
            book.publisher_id.country_id = book.publisher_country_id
    
    def _search_publisher_country(self, operator, value):
        return [('publisher_id.country_id', operator, value)]
    
    
    publisher_country_id = fields.Many2one(
        "res.country", 
        string="Publisher Country", 
        compute='_compute_publisher_country', 
        inverse="_inverse_publisher_country",
        search="_search_publisher_country")

    _sql_constraints = [("library_book_name_date_uq", 
                         "UNIQUE(name, date_published)", 
                         "Title and publication date must be unique."), 
                         ("library_book_check_date", 
                          "CHECK(date_published <= current_date)", 
                          "Publication date must not be in the future.")]
    
    @api.constrains("isbn")
    def _constraint_isbn_valid(self):
        for book in self:
            if book.isbn and not book._check_isbn():
                raise ValidationError("%s is an invalid ISBN"%book.isbn)

    def _check_isbn(self):
        self.ensure_one()
        digits=[int(x) for x in self.isbn if x.isdigit()]
        if len(digits) == 13:
            ponderations = [1, 3] * 6
            terms = [a*b for a, b in zip(digits[:12], ponderations)]
            remain = sum(terms) %10
            check = 10 - remain if remain != 0 else 0
            return digits[-1] == check

    def button_check_isbn(self):
        for book in self:
            if not book.isbn:  
                raise ValidationError("Please provide an ISBN for %s" %book.name)
            if book.isbn and not book._check_isbn():
                raise ValidationError("%s ISBN is invalid" %book.isbn)
        return True