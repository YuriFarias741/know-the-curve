from django.db import models

# Create your models here.
class Occurrence(models.Model):
    """Models a COVID-19 Register"""
    state = models.CharField(max_length=2)
    state_full_name = models.CharField(max_length=50)
    date = models.DateTimeField()
    death_count = models.IntegerField()
    cases_count = models.IntegerField()
