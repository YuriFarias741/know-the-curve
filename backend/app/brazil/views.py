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

import plotly.graph_objects as go
from plotly.offline import plot

from brazil.consts import URL_LOCALIDADES, URL_POPULACAO, URL_COVID_STATUS
from brazil.models import Occurrence
from brazil.data.selected.urbanization_cut import URBANIZATION
from core.utils import export_plot

@api_view(['GET',])
def state_full_listing(request):
    today = timezone.localtime(timezone.now()).date()
    month_list = [today - datetime.timedelta(days=x) for x in range(7)]
    month_occurences_per_state = {}
    for day in month_list:
        daily_occurences = Occurrence.objects.filter(date_occured=day)
        for occurence in daily_occurences:
            if not month_occurences_per_state.get(occurence.state.state, None):
                month_occurences_per_state[occurence.state.state] = {}
            month_occurences_per_state[occurence.state.state][day.strftime("%d/%m/%Y")] = occurence.cases_count
    state_data = {}
    for k, v in month_occurences_per_state.items():
        d = sorted(v.items(), key=lambda item: item[0]) # Order by date
        case_array = [item[1] for item in d]
        response = requests.get(f"https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf/{k.lower()}/").json()
        current_cases = response["cases"]
        current_deaths = response["deaths"]
        state_data[k] = {"cases": current_cases, "deaths": current_deaths, "slope": case_array[-1] - case_array[0]}
    return Response(state_data, status=status.HTTP_200_OK)


class StateCasesTimeSeries(TemplateView):
    template_name = 'plot_frame.html'

    def get(self, request, state):
        state_occurences = Occurrence.objects.filter(state__state=state.upper()).order_by('date_occured').values_list('cases_count', 'date_occured')
        cases, dates = zip(*state_occurences)
        print(dates)
        print(cases)
        fig = go.Figure(data=go.Scatter(x=dates, y=cases))
        fig.update_layout(title=f'COVID-19 Cases per time in the state of {state.upper()}', xaxis_title='time', yaxis_title='cases')
        exported_plot = plot(fig, output_type='div')
        context = {'graphic': exported_plot}
        return render(request, self.template_name, context)


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
        exported_plot = export_plot(casos, populacao, 'Confirmed cases per state vs demographic density',
                                    estados, output_type="div", xaxis_type="log", yaxis_type="linear",
                                    textposition='top center')
        context = {'graphic': exported_plot}
        return render(request, self.template_name, context)

class UrbanizationLandPerRegion(TemplateView):
    template_name = 'plot_frame.html'

    def get(self, request):
        response = requests.get(URL_LOCALIDADES).json()
        estados_localidade = {item["sigla"]:item["id"] for item in response}
        estado_populacao_casos_dict = {}
        for estado, localidade in estados_localidade.items():
            populacao = requests.get(URL_POPULACAO.format(localidade)).json()["projecao"]["populacao"]
            casos = requests.get(URL_COVID_STATUS.format(estado.lower())).json()["cases"]
            estado_populacao_casos_dict[estado] = (populacao, casos)
        region_vs_cases = {}
        for region, data in URBANIZATION.items():
            region_vs_cases[region] = {'cases': 0, 'urban_center_land_area': data['urban_center_land_area']}
            for curr_state in data['related_states']:
                region_vs_cases[region]['cases'] += estado_populacao_casos_dict[curr_state][1]
        regions = []
        cases = []
        urban_center_land_areas = []
        for k, v in region_vs_cases.items():
            regions.append(k)
            cases.append(v['cases'])
            urban_center_land_areas.append(v['urban_center_land_area'])
        exported_plot = export_plot(cases, urban_center_land_areas, 'Confirmed cases per region vs urban center land area in sq km',
                                    regions, output_type="div", xaxis_type="linear", yaxis_type="log",
                                    textposition='top center')
        context = {'graphic': exported_plot}
        return render(request, self.template_name, context)
