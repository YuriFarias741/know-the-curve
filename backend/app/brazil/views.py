import requests
import json
import datetime
from datetime import timedelta
import numpy as np

from django.shortcuts import render
from django.utils import timezone

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from brazil.consts import URL_LOCALIDADES, URL_POPULACAO, URL_COVID_STATUS

@api_view(['GET',])
def state_full_listing(request):
    today = timezone.localtime(timezone.now()).date()
    week_list = [today - datetime.timedelta(days=x) for x in range(7)]
    print(week_list)
    week_occurrences_per_state = {}
    for day in week_list:
        response = requests.get(f'https://covid19-brazil-api.now.sh/api/report/v1/brazil/{day.strftime("%Y%m%d")}').json()
        print(response)
        for data in response["data"]:
            if not week_occurrences_per_state.get(data["uf"], None):
                week_occurrences_per_state[data["uf"]] = {}
            week_occurrences_per_state[data["uf"]][day.strftime("%d/%m/%Y")] = data["cases"]
    state_data = {}
    for k, v in week_occurrences_per_state.items():
        d = sorted(v.items(), key=lambda item: item[0])
        datas = np.array([item[0] for item in d])
        casos_variacao = np.array([item[1] for item in d])
        casos = requests.get(f"https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf/{k.lower()}/").json()["cases"]
        state_data[k] = {"casos": casos, "variacao": casos_variacao[-1] - casos_variacao[0]}
    return Response(state_data, status=status.HTTP_200_OK)
