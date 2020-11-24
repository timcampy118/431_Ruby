import os, pdb, json, csv, datetime
from io import StringIO
import urllib.request

def covidCases():
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

def mobility():
	data = {}
	with open('../data/raw/2020_US_Region_Mobility_Report.csv') as f:
		reader = csv.reader(f, delimiter=',')
		next(reader)
		for row in reader:
			if row[6]:
				if row[6] not in data:
					data[row[6]] = {}
				data[row[6]][row[7]] = [row[8], row[9], row[10], row[11], row[12], row[13]]
	startDate = datetime.date(2020, 1, 27)
	endDate = datetime.date(2020, 8, 24)

	csvData = [['date', 'fips', 'retail', 'grocery', 'parks', 'transit', 'workplace', 'residential']]
	for key in data:
		currentWeek = startDate
		while ((endDate - currentWeek).days >= 0):
			rowData = [0]*6
			rowDataStr = ['']*6
			rowCount = [0]*6
			for i in range(7):
				day = (currentWeek + datetime.timedelta(days=i)).strftime('%Y-%m-%d')
				if day in data[key]:
					for j in range(6):
						value = data[key][day][j]
						if value == '':
							value = "0"
						else:
							rowCount[j] += 1
						rowData[j] = rowData[j] + int(value)

				for j in range(6):
					rowCount[j] = max(rowCount[j], 1)
					rowDataStr[j] = str(int(rowData[j] / rowCount[j]))

			row = [currentWeek.strftime('%m/%d/%Y'), key] + rowDataStr
			csvData.append(row)
			currentWeek = currentWeek + datetime.timedelta(days=7)

	with open('raw/CovidMobilityUpdated.csv', 'w', newline='') as f:
		writer = csv.writer(f, delimiter=',')
		for row in csvData:
			writer.writerow(row)

if __name__ == '__main__':
	covidCases()
	mobility()