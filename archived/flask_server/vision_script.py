#!/usr/bin/env python3

from google.cloud import vision
import os
import pandas as pd
# import cv2

max_layer = 4
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'carbon-7fbf76411514.json'
data = pd.read_csv("dataFake.csv", sep=';')


def searchData(product):
    data = pd.read_csv("dataFake.csv", sep=';')
    for i in range(0, len(data.index)-1):
        if(data.loc[i]['typeFood'] == product):
            return data.loc[i]['Cfootprint']
    return None

# Uses Google Vision API to get the labels of the picture.
# @param content: holds content of the picture


def get_vision_response(content):
    response = []
    client = vision.ImageAnnotatorClient()
    image = vision.types.Image(content=content)
    result = client.label_detection(image=image)
    for i in range(0, len(result.label_annotations)):
        response.append(result.label_annotations[i].description)
    return response

# Function which return the carbon footprint/kg of the first product label present in the data set.
# If none of the product labels are present in the data set returns 0.
# @param response: stores the labels of a product.


def first_layer_search(response):
    print(response)
    carbon = None
    for i in range(0, len(response)):
        carbon = searchData(response[i])
        if(carbon != None):
            return carbon
    return carbon

# This is called in get_carbon in case first_layer_search failed. It finds concepts related to product layers and searches
# data set for their carbon footprint/kg. If none of the related concepts are present in the data set returns 0.


def next_layer_search(response):
    carbon = None
    next_response = []
    for i in range(0, len(response)):
        label = response[i]
        obj = requests.get('http://api.conceptnet.io/query?start=/c/en/' +
                           label + '&rel=/r/IsA&limit=1000').json()  # DO WE NEED LIMIT????
        for j in range(0, len(obj['edges'])):
            concept = obj['edges'][i]['end']['label']
            carbon = searchData(concept)
            next_response.append(concept)
            if carbon != None:
                return carbon
    response = next_response
    return carbon

# Function which returns the carbon footprint/kg of the product displayed in the picture. If carbon footprint/kg
# is not found, returns 0.
# @param content: holds content of the picture


def get_carbon(content):
    layer = 0
    carbon = None
    response = get_vision_response(content)
    carbon = first_layer_search(response)
    while carbon == None and layer < max_layer:
        carbon = next_layer_search(response)
        layer += 1
    print(carbon)
    return carbon
