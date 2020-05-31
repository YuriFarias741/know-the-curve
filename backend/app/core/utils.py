import plotly.graph_objects as go
from plotly.offline import plot
import datetime
import functools
from collections import namedtuple
import numpy

def export_plot(x, y, name, labels, output_type="div", xaxis_type="linear", yaxis_type="log", textposition=None):
    fig = go.Figure(data=go.Scatter(x=x,
                                    y=y,
                                    mode='markers+text',
                                    marker_color=y,
                                    text=labels)) # hover text goes here

    if textposition is not None:
        fig.update_traces(textposition=textposition)
    fig.update_layout(title=name, yaxis_type=yaxis_type, xaxis_type=xaxis_type)
    fig.show()
    return plot(fig, output_type=output_type, include_plotlyjs=False)
