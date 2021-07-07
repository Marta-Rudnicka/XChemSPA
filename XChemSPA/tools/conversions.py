import string 

def create_well_dict():
	
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

#    i = 0
#    for item in well_name_list_1:
#        well_dictionary[well_name_list_echo[i]] = item
#        i = i + 1
    
    i = 0
	
    for item in well_name_list_echo:
        well_dictionary[well_name_list_1[i]] = item
        i = i + 1

    return well_dictionary