import requests
import json
import datetime
from datetime import timedelta
import numpy as np

from django.shortcuts import render
from django.utils import timezone
from django.views.generic import TemplateView

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from brazil.consts import URL_LOCALIDADES, URL_POPULACAO, URL_COVID_STATUS
from core.utils import export_plot

@api_view(['GET',])
def state_full_listing(request):
    today = timezone.localtime(timezone.now()).date()
    week_list = [today - datetime.timedelta(days=x) for x in range(7)]
    print(week_list)
    week_occurrences_per_state = {}
    for day in week_list:
        response = requests.get(f'https://covid19-brazil-api.now.sh/api/report/v1/brazil/{day.strftime("%Y%m%d")}').json()
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
        state_data[k] = {"cases": casos, "slope": casos_variacao[-1] - casos_variacao[0]}
    return Response(state_data, status=status.HTTP_200_OK)

class DemographicDensityPerState(TemplateView):
    template_name = 'plot_frame.html'

    def get(self, request):
        response = requests.get(URL_LOCALIDADES).json()
        estados_localidade = {item["sigla"]:item["id"] for item in response}
        estado_populacao_casos_dict = {}
        for estado, localidade in estados_localidade.items():
            populacao = requests.get(URL_POPULACAO.format(localidade)).json()["projecao"]["populacao"]
            casos = requests.get(URL_COVID_STATUS.format(estado.lower())).json()["cases"]
            estado_populacao_casos_dict[estado] = (populacao, casos)
        estado_populacao_casos = sorted(estado_populacao_casos_dict.items(), key=lambda item: item[1][1])
        estados = np.array([item[0] for item in estado_populacao_casos])
        populacao = np.array([item[1][0] for item in estado_populacao_casos])
        casos = np.array([item[1][1] for item in estado_populacao_casos])
        exported_plot = export_plot(casos, populacao, 'Confirmed cases per state vs demographic density', estados, output_type="div", xaxis_type="log", yaxis_type="linear")
        context = {'graphic': exported_plot}
        return render(request, self.template_name, context)
