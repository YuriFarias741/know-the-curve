import requests
import json
import datetime
from datetime import timedelta

from django.shortcuts import render
from django.utils import timezone

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from brazil.consts import URL_LOCALIDADES, URL_POPULACAO, URL_COVID_STATUS

@api_view(['GET',])
def state_full_listing(request):
    today = timezone.localtime(timezone.now()).date()
    week_list = [base - datetime.timedelta(days=x) for x in range(7)]
    week_occurrences = []
    for day in week_list:
        response = requests.get(f'https://covid19-brazil-api.now.sh/api/report/v1/brazil/{day.strftime("%Y%m%d")}').json()
        for data in response["data"]:
            week_occurrences.append(data)
    return Response(json.loads({"occurrences": week_occurrences}), status=status.HTTP_200_OK)
