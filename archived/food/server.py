# SERVER
# !/usr/bin/env python3

import socket
import struct
import base64
from vision_script import get_carbon

s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
ADDRESS = ('', 65432)
s.bind(ADDRESS)

while True:
    print("Server waiting for connection ...")
    s.listen(10)
    try:
        # receive size of the image
        sc, info = s.accept()
        print("Client connected:", info)
        len_str = sc.recv(4)
        size = struct.unpack('!i', len_str)[0]
        print('size:', size)

        # receive image as a string
        img_str = b''
        while size > 0:
            if size >= 4096:
                data = sc.recv(4096)
            else:
                data = sc.recv(size)
            if not data: break
            size -= len(data)
            img_str += data
        print('len:', len(img_str))

        # calculate carbon footprint
        image = base64.b64decode(img_str)
        carbon = get_carbon(image)
        print("Carbon Footprint: ", carbon)

        # send result
        sc.send(carbon)

        #close conection with the client
        sc.close()

    except:
         s.close()
         print("Socket closed ...")
         sys.exit()
