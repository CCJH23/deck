from django.db import models
from inventory.globals import action_choices, action_reasons
from django.contrib.auth.models import User

"""
* A class that encapsulates an Order placed by the user.

    ** Attributes
    ----------
    -> action : CharField
        Withdraw or Deposit (limited to choices specified in action_choices)
    -> reason : CharField
        Reason for withdrawal or deposit (limited to choices specified in action_options)
    -> date : DateTimeField
        Date of withdrawal or deposit
    -> user : ForeignKey
        User who made the withdrawal or deposit
    -> other_info : CharField
        Other information about the withdrawal or deposit

    -> TODO: Link OrderItems to Order for quicker queries
        
    ** Methods
    -------
    -> TBD
"""


class Order(models.Model):
    action = models.CharField(max_length=50, choices=action_choices)
    reason = models.CharField(max_length=50, choices=action_reasons)
    date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    other_info = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.action}, {self.reason}, {self.date}, {self.user}"
