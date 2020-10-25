import os, pdb, json, csv, datetime
from io import StringIO
import urllib.request

def main():
	fileData = None
	data = {}

	with urllib.request.urlopen('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv') as f:
		fileData = f.read().decode('utf-8')

	reader = csv.reader(StringIO(fileData), delimiter=',')

	next(reader, None)
	for row in reader:
		date = row[0]
		dateSplit = date.split('-')

		# if not Monday, skip
		if datetime.datetime(int(dateSplit[0]), int(dateSplit[1]), int(dateSplit[2])).weekday() > 0:
			continue

		# if no entries added to date, create date
		if date not in data:
			data[date] = {}		

		data[date][row[3]] = row[4:]

	with open('../data/covid_cases.json', 'w', encoding='utf-8') as f:
		json.dump(data, f)

if __name__ == '__main__':
	main()