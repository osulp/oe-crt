TO Add to data:
1. Get updated shapefiles from Census for OR and CA
2. Select features that intersect Siskyou County and merge with Oregon features.
3. Project to Web Mercator Aux Sphere (3857)
4. Run Simplify Polygon (Cartography) using Bend Simplify at 500+ m tolerance
5. Export merged and projected shapefile as shapefile.
6. Use qGIS to convert to Geojson.
7. Import the exported merged and projected shapefile into qGIS.
8. Save the layer as geojson, specify an output path and name (places_2018) and set coord precision to 0 (Web Merc is all integer).
9. Change the extension from .geojson to .json.  Grab the contents in a text editor and paste into a JSON Linter.  https://jsonlint.com/
10.  Add three attributes to the top of the file so it looks like this replacing based on  feature type (places, tracts, counties) and year:

{"type":"FeatureCollection","layerName":"Places 2018","layerType":"Places","Year":"2018",

11.  Use a minimizer to reduce file size.  Paste text into: https://tools.knowledgewalls.com/jsonminimizer
12.  Put the completed json file in the assests/geojson folder.  Update the code in git and pull into master.  Copy the output to web server (lib-arcgis1)
13.  Add an entry in the database for the table GeoYear for the place type and year.
14.  Run the [rebuild_PlaceGeoInfoCRT_Table] stored proc to update the PlaceGeoInfo table.

