#!/usr/bin/env python3

import requests

address = 'http://127.0.0.1:5000'
url = address + '/upload/'
content_type = 'image/jpg'

headers = {'content-type': content_type, 'h': 100, 'w': 100}

content = {'image': open('apples.jpg', 'rb')}
print(content)
response = requests.post(url, files=content)
print(response)
