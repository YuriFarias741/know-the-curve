from django.db import models

class State(models.Model):
    state = models.CharField(max_length=2)
    state_full_name = models.CharField(max_length=50)
    ibge_locality_id = models.IntegerField()

    def __str__(self):
        return f"{self.state_full_name} ({self.state})"


class Occurrence(models.Model):
    """Models a COVID-19 Register"""
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    population = models.IntegerField(null=True, blank=True)
    date_occured = models.DateField(null=True, blank=True)
    death_count = models.IntegerField()
    cases_count = models.IntegerField()

    def __str__(self):
        return f"{self.state} - {self.cases_count} cases - {self.date_occured}"
