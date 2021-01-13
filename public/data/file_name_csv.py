import os
import sys
import csv
data = []
for file in os.listdir(sys.argv[1]):
    if file.endswith(".mp4"):
        data.append(file)


wtr = csv.writer(open ('cb_video_list.csv', 'w'), delimiter=',', lineterminator='\n')
for x in data : wtr.writerow ([x])
