import pandas as pd
import json

# Load the CSV file
csv_file_path = 'data/Mor Lum data - test.csv'
df = pd.read_csv(csv_file_path)

# Assuming columns: latitude, longitude, province, other properties...
# Example structure: latitude, longitude, province, mine_id, comname_t, resource_n, unit_n, rai

# Function to convert DataFrame to GeoJSON
def df_to_geojson(df, properties, lat='latitude', lon='longitude'):
    geojson = {'type': 'FeatureCollection', 'features': []}
    for _, row in df.iterrows():
        feature = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [row[lon], row[lat]]
            },
            'properties': {prop: row[prop] for prop in properties}
        }
        geojson['features'].append(feature)
    return geojson

# Define the properties to include in GeoJSON
properties = ['province', 'mine_id', 'comname_t', 'resource_n', 'unit_n', 'rai']
geojson_data = df_to_geojson(df, properties)

# Save to GeoJSON file
geojson_file_path = '/mnt/data/Mor_Lum_data.geojson'
with open(geojson_file_path, 'w') as f:
    json.dump(geojson_data, f)
