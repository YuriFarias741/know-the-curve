# Related state is used to select the urbanization region
# The data displayed here is the land of urban centers per region in square km
URBANIZATION = {
    "Southeast": {
        'related_states': ['SP', 'ES', 'MG', 'RJ'],
        'urban_center_land_area': 9368,
        'covid_cases': 0, # initialization value
    },
    "South": {
        'related_states': ['RS', 'SC', 'PR'],
        'urban_center_land_area': 3099,
        'covid_cases': 0,
    },
    "Northeast": {
        'related_states': ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
        'urban_center_land_area': 1535,
        'covid_cases': 0,
    },
    "CentralWest": {
        'related_states': ['DF', 'GO', 'MS', 'MT'],
        'urban_center_land_area': 2088,
        'covid_cases': 0,
    },
    "North": {
        'related_states': ['AC', 'AM', 'AP', 'PA', 'RO' , 'RR', 'TO'],
        'urban_center_land_area': 1435,
        'covid_cases': 0,
    }
}
