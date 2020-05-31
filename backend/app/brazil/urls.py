from django.urls import path

from . import views


app_name = 'brazil'

urlpatterns = [
    path('', views.state_full_listing),
    path('demographic_density', views.DemographicDensityPerState.as_view(), name='demographic_density_vs_states'),
]
