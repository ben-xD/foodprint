# MOCK CLIENT TO TEST THE SERVER
#!/usr/bin/env python3

import socket
import struct
import cv2
import base64

image = cv2.imread("apple.jpeg")

with open("apple.jpeg", "rb") as imageFile:
    img_str = base64.b64encode(imageFile.read())

s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
ADDRESS = ('', 65432)
s.connect(ADDRESS)

# send string size
len_str = struct.pack('!i', len(img_str))
s.send(len_str)

# send string image
s.send(img_str)

# receive result
carbon = s.recv(4096)
print("Carbon Footprint: ", int.from_bytes(carbon, "little"))
