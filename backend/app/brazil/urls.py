from django.urls import path

from . import views


app_name = 'brazil'

urlpatterns = [
    path('/', views.state_full_listing),
]
