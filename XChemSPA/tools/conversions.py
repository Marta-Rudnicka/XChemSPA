import string 
from datetime import datetime, timedelta, timezone

def create_well_dict():
    '''creates a dictionary used to convert well names following the markings on the
    SwissCI-3drop crystallization plate to naming system used in Echo'''
    #'human readable' format: [A - H][01-12][a-d], e.g. B09c, F12a
	
    #generate lists of strings to concatenate into well names
    part_1 = list(string.ascii_uppercase)[0:8]
    part_2 = []
    for x in range(1,13):
        if x<10:
            part_2.append('0' + str(x))
        else:
            part_2.append(str(x))

    part_3 = [['a', 'c'], ['b', 'd']]

    #generate an ordered list of all well names in the human readable system
    well_name_list_1 = []
	
    for number in part_2:
        for charlist in part_3:
            for cap in part_1:
                for letter in charlist:
                    well_name_list_1.append(cap + number + letter)

	
	#Echo  format: [A-P][1-24], e.g D2, H19
	
	#generate an ordered list of all well names
    well_name_list_echo = []

    part_1_echo = list(string.ascii_uppercase)[0:16]
    for number in range(1, 25):
        for letter in part_1_echo:
            well_name_list_echo.append(letter + str(number))


	#create a dictionary matching the names
    well_dictionary = {}
    
    i = 0
	
    for item in well_name_list_echo:
        well_dictionary[well_name_list_1[i]] = item
        i = i + 1

    return well_dictionary

def js_utcstr_to_python_date(date_str):
    '''converts output of JavaScript Date.toUTCString() to a timezone aware Python datetime object'''
    timestamp = datetime.strptime(date_str, "%a, %d %b %Y %H:%M:%S %Z")
    timestamp = timestamp.replace(tzinfo=timezone.utc)

    return timestamp

def shifter_2_datetime(str):
    '''converts timestamp string produced by Shifter to a Python datetime object'''
    str = str + '00000' #add a few zeros so the tenths of seconds can be parsed as microsends
    return datetime.strptime(str, "%Y-%m-%d %H:%M:%S.%f")


def shifter_2_timedelta(str):
    '''converts time duration string produced by Shifter to a Python timedelta object'''
    str = str + '00000'
    t = datetime.strptime(str, "%H:%M:%S.%f")
    return timedelta(hours=t.hour, minutes=t.minute, seconds=t.second, microseconds=t.microsecond)

def shifter_2_drop_name(row):
    '''concatenates fields in Shifter output into a SwissCI well name'''
    well = row[3]
    if len(row[4]) == 1: #add leading zero if needed
        well = well + '0' 
    return well + row[4] + row[5]