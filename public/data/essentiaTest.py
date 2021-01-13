import sys
import essentia
import essentia.standard as es
import os
import csv

data = []
path = sys.argv[1]
for file in os.listdir(path):
    if file.endswith(".wav"):
        data.append(file)

feats = ['lowlevel.average_loudness','lowlevel.dynamic_complexity','lowlevel.pitch_salience.mean',\
'lowlevel.spectral_centroid.mean','lowlevel.spectral_energy.mean','lowlevel.spectral_flux.mean',\
'rhythm.bpm','rhythm.beats_loudness.mean','tonal.key_krumhansl.key']

opus = []
for i in data:
    # Compute all features, aggregate only 'mean' and 'stdev' statistics for all low-level, rhythm and tonal frame features
    features, features_frames = es.MusicExtractor(lowlevelStats=['mean', 'stdev'],
                                                  rhythmStats=['mean', 'stdev'],
                                                  tonalStats=['mean', 'stdev'])(path+'/'+str(i))
    opus.append([i, [features[i] for i in feats]])

wtr = csv.writer(open ('cb_audio_list.csv', 'w'), delimiter=',', lineterminator='\n')
for x in opus : wtr.writerow ([x])

# See all feature names in the pool in a sorted order
#print(sorted(features.descriptorNames()))


# print(features['lowlevel.average_loudness'])
# print(features['lowlevel.dynamic_complexity'])
# print(features['lowlevel.pitch_salience.mean'])
# print(features['lowlevel.spectral_centroid.mean'])
# #print(features['lowlevel.spectral_contrast_coeffs.mean'])
# print(features['lowlevel.spectral_energy.mean'])
# print(features['lowlevel.spectral_flux.mean'])
# print(features['rhythm.bpm'])
# print(features['rhythm.beats_loudness.mean'])
# print(features['tonal.key_krumhansl.key'])

# print("Filename:", features['metadata.tags.file_name'])
# print("-"*80)
# print("Replay gain:", features['metadata.audio_properties.replay_gain'])
# print("EBU128 integrated loudness:", features['lowlevel.loudness_ebu128.integrated'])
# print("EBU128 loudness range:", features['lowlevel.loudness_ebu128.loudness_range'])
# print("-"*80)
# print("MFCC mean:", features['lowlevel.mfcc.mean'])
# print("-"*80)
# print("BPM:", features['rhythm.bpm'])
# print("Beat positions (sec.)", features['rhythm.beats_position'])
# print("-"*80)
# print("Key/scale estimation (using a profile specifically suited for electronic music):",
#       features['tonal.key_edma.key'], features['tonal.key_edma.scale'])
