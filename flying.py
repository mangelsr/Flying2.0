import time

from flask import Flask, jsonify, Response, request, render_template
from pymongo import MongoClient # Database connector
from bson.objectid import ObjectId # For ObjectId to work

client = MongoClient('localhost', 27017)    #Configure the connection to the database
db = client.flying    #Select the database

app = Flask(__name__)

@app.route('/')
def index():
	paises = db.countries.distinct('name')
	return render_template('formulario.html', paises=paises)

@app.route('/find/', methods = ['POST'])
def find():
	start = time.time()

	paises = db.countries.distinct('name')

	origen = request.json['origen']
	destino = request.json['destino']
	stops = int(request.json['tipo'])	

	aeropuertos_origen = db.airports.find({'country': origen}, {'airportID': 1})
	aeropuertos_destino = db.airports.find({'country': destino}, {'airportID': 1})
	
	aero_origen = []
	for r in aeropuertos_origen:
		aero_origen.append(r.get('airportID'))

	aero_destino = []
	for r in aeropuertos_destino:
		aero_destino.append(r.get('airportID'))
	
	routes = db.routes.find({'sAirportID': {"$in": aero_origen}, 
							'dAirportID': {"$in": aero_destino}, 
							'stops': stops})

	rutas = []
	for r in routes:
		try: 
			ruta = {}
			ruta['aerolinea'] = db.airlines.find_one({'airlineID': r['airlineID']}, {'name': 1})['name']
			ruta['aero_origen'] = db.airports.find_one({'airportID': r['sAirportID']}, {'name': 1})['name']
			ruta['aero_destino'] = db.airports.find_one({'airportID': r['dAirportID']}, {'name': 1})['name']
			ruta['paradas'] = r['stops']
			rutas.append(ruta)
		except:
			pass
		
	end = time.time()
	
	print(end - start)

	return jsonify(rutas)
		
if __name__ == '__main__':
    app.run(debug=True, port=8080)