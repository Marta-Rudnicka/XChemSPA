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


export const combinations = [
			{
				'id' : 1,
				'library' : 'DSI_poised', 
				'plate' : 'plate_name1',
				'combinations' : 150,
				'items':  300 
			},
			{
				'id' : 2,
				'library' : 'York3D', 
				'plate' : 'plate_name2',
				'combinations' : 90,
				'items':  200 
			}, 
			{
				'id' : 3,
				'library' : 'FragLites', 
				'plate' : 'plate_name3',
				'combinations' : 62,
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





const lab1 = [
	{
		"source_well" : "A1",
		"code": "CODE-STRING-1",
		"smiles": "SMILES_STRING",
		"drop" : "A1c"
	},
	{
		"source_well" : "A2",
		"code": "CODE-STRING-2",
		"smiles": "SMILES_STRING",
		"drop" : "A1d"
	},
		{
		"source_well" : "A3",
		"code": "CODE-STRING-3",
		"smiles": "SMILES_STRING",
		"drop" : "A3a"
	},
		{
		"source_well" : "A4",
		"code": "CODE-STRING-4",
		"smiles": "SMILES_STRING",
		"drop" : "A3d"
	},
		{
		"source_well" : "A5",
		"code": "CODE-STRING-5",
		"smiles": "SMILES_STRING",
		"drop" : "A7a"
	},
		{
		"source_well" : "A6",
		"code": "CODE-STRING-6",
		"smiles": "SMILES_STRING",
		"drop" : "A7c"
	},
		{
		"source_well" : "A7",
		"code": "CODE-STRING-7",
		"smiles": "SMILES_STRING",
		"drop" : "A7d"
	},
		{
		"source_well" : "A8",
		"code": "CODE-STRING-8",
		"smiles": "SMILES_STRING",
		"drop" : "A8a"
	},
		{
		"source_well" : "A9",
		"code": "CODE-STRING-9",
		"smiles": "SMILES_STRING",
		"drop" : "A9c"
	},
		{
		"source_well" : "A10",
		"code": "CODE-STRING-10",
		"smiles": "SMILES_STRING",
		"drop" : "A9d"
	}
]

const lab2 = [
	{
		"compounds" : [
				{
					"source_well" : "A1",
					"code": "CODE-STRING-1",
					"smiles": "SMILES_STRING",
					"related_crystal" : "Related-Crystal-1",
					"soak" : 1
				},
				{
					"source_well" : "A2",
					"code": "CODE-STRING-2",
					"smiles": "SMILES_STRING",
					"related_crystal" : "Related-Crystal-2",
					"soak" : 2
				}
		],
		"drop" : "A11a"
	},
	{
		"compounds" : [
				{
					"source_well" : "A3",
					"code": "CODE-STRING-3",
					"smiles": "SMILES_STRING",
					"related_crystal" : "Related-Crystal-3",
					"soak" : 1
				},
				{
					"source_well" : "A4",
					"code": "CODE-STRING-4",
					"smiles": "SMILES_STRING",
					"related_crystal" : "Related-Crystal-4",
					"soak" : 2
				}
		],
		"drop" : "A11c"
	},
	{
		"compounds" : [
				{
					"source_well" : "A5",
					"code": "CODE-STRING-5",
					"smiles": "SMILES_STRING",
					"related_crystal" : "Related-Crystal-5",
					"soak" : 1
				},
				{
					"source_well" : "A6",
					"code": "CODE-STRING-6",
					"smiles": "SMILES_STRING",
					"related_crystal" : "Related-Crystal-6",
					"soak" : 2
				}
		],
		"drop" : "A11d"
	},
	{
		"compounds" : [
				{
					"source_well" : "A7",
					"code": "CODE-STRING-7",
					"smiles": "SMILES_STRING",
					"related_crystal" : "Related-Crystal-7",
					"soak" : 1
				},
				{
					"source_well" : "A8",
					"code": "CODE-STRING-8",
					"smiles": "SMILES_STRING",
					"related_crystal" : "Related-Crystal-8",
					"soak" : 2
				}
		],
		"drop" : "A12a"
	},
	{
		"compounds" : [
				{
					"source_well" : "A9",
					"code": "CODE-STRING-9",
					"smiles": "SMILES_STRING",
					"related_crystal" : "Related-Crystal-9",
					"soak" : 1
				},
				{
					"source_well" : "A10",
					"code": "CODE-STRING-10",
					"smiles": "SMILES_STRING",
					"related_crystal" : "Related-Crystal-10",
					"soak" : 2
				}
		],
		"drop" : "B1a"
	}
]

export const batches = [
					{
						"number" : 1,
						"library" : "Library1",
						"libraryPlate" : "b4r-c0d3-1",
						"crystalPlate" : "X-b4r-c0d3-1",
						"type" : "single",
						"crystals" : lab1
					},
					{
						"number" : 2,
						"library" : "Library1",
						"libraryPlate" : "b4r-c0d3-1",
						"crystalPlate" : "X-b4r-c0d3-1",
						"type" : "multi",
						"crystals" : lab2
					}
				]

export default combinations;
