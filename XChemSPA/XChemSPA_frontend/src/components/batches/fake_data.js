/*
def generate_well_names(highest_letter, highest_number): 
	
	#generate lists of strings to concatenate into well names
	part_1 = list(string.ascii_uppercase)[0:highest_letter]
	part_2 = []
	for x in range(1,highest_number):
		if x<10:
			part_2.append('0' + str(x))
		else:
			part_2.append(str(x))

	part_3 = [['a', 'c'], ['d']]

	#generate an ordered list of all well names in $naming_system_1
	well_name_list = []
	
	for number in part_2:
		for charlist in part_3:
			for cap in part_1:
				for letter in charlist:
					well_name_list.append(cap + number + letter)
	return well_name_list
	*/
/*
# a real crystallisation plate	
wells = generate_well_names(8, 13)
# a model of a crystallisation plate for testing (with fewer pictures to load)
wells_small = generate_well_names(3, 4)
#parts of a plate model to simulate partially used plate
wells_small_1 = wells_small[0:8]
wells_small_2 = wells_small[8:-1]
*/

export const libraries1 = [
			{
				'id' : 1,
				'library' : 'DSI_poised', 
				'plate' : 'plate_name1',
				'items':  300 
			},
			{
				'id' : 2,
				'library' : 'York3D', 
				'plate' : 'plate_name2',
				'items':  200 
			}, 
			{
				'id' : 3,
				'library' : 'FragLites', 
				'plate' : 'plate_name3',
				'items':  127 
			}
		]
		
export const libraries2 = [
			{
				'id' : 1,
				'library' : 'DSI_poised', 
				'plate' : 'plate_name1',
				'items':  96 
			},
			{
				'id' : 2,
				'library' : 'York3D', 
				'plate' : 'plate_name2',
				'items':  84 
			}
		]

export const crystal_plates1 = [ 
						{
							'id' : 1, 
							'name' : 'Crystallisation_Plate1', 
							'items' : 150
						},
						{ 
							'id' : 2,
							'name' : 'Crystallisation_Plate2', 
							'items' : 200
						},
						{
							'id' : 3,						
							'name' : 'Crystallisation_Plate3', 
							'items' : 103
						},
						{			
							'id' : 4,			 
							'name' : 'Crystallisation_Plate4', 
							'items' : 86
						},
						{			
							'id' : 5,			 
							'name' : 'Crystallisation_Plate5', 
							'items' : 37
						}
					]
						
export const crystal_plates2 = [ 
						{ 
							'id' : 1,
							'name' : 'Crystallisation_Plate1', 
							'items' : 92
						},
						{ 
							'id' : 2,
							'name' : 'Crystallisation_Plate2', 
							'items' : 56
						},
						{			
							'id' : 3,			 
							'name' : 'Crystallisation_Plate3', 
							'items' : 86
						}
					]
