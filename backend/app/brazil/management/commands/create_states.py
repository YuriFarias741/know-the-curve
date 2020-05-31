import datetime
from datetime import date, timedelta

import requests

from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from brazil.models import State, Occurrence

from brazil.consts import URL_LOCALIDADES, URL_POPULACAO

class Command(BaseCommand):
    help = 'Alimenta o BD com os estados caso não existam'

    def handle(self, *args, **options):
        response = requests.get(URL_LOCALIDADES).json()
        estados_localidade = {item["sigla"]:(item["id"], item["nome"]) for item in response}
        estado_populacao_casos_dict = {}
        for estado, localidade in estados_localidade.items():
            State.objects.get_or_create(state=estado, state_full_name=localidade[1], ibge_locality_id=localidade[0])
        first_day_queried = datetime.datetime.strptime("10/02/2020", "%d/%m/%Y").date()
        today = timezone.localtime(timezone.now()).date()
        delta = today - first_day_queried
        for i in range(delta.days + 1):
            day = first_day_queried + timedelta(days=i)
            day_cases = requests.get(f'https://covid19-brazil-api.now.sh/api/report/v1/brazil/{day.strftime("%Y%m%d")}').json()
            for case in day_cases["data"]:
                state = State.objects.get(state=case["uf"])
                print(f"Registering case... ({day} - {case['uf']})")
                population = requests.get(URL_POPULACAO.format(state.ibge_locality_id)).json()["projecao"]["populacao"]
                cases = case["cases"]
                deaths = case["deaths"]
                Occurrence.objects.get_or_create(state=state, population=population, date_occured=day, death_count=deaths, cases_count=cases)
