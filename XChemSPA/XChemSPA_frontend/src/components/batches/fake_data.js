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
						"dropVolume" : 60,
						"crystalPlate" : "X-b4r-c0d3-1",
						"type" : "single",
						"crystals" : lab1
					},
					{
						"number" : 2,
						"library" : "Library1",
						"libraryPlate" : "b4r-c0d3-1",
						"dropVolume" : 50,
						"crystalPlate" : "X-b4r-c0d3-1",
						"type" : "multi",
						"crystals" : lab2
					}
				]

const flCompounds = [
    {
        "compound": {
            "id": 1027,
            "code": "NCL-00023819",
            "smiles": "BrC1=CNN=C1",
            "properties": {
                "log_p": 1.1722,
                "mol_wt": 145.947960196,
                "heavy_atom_count": 6,
                "heavy_atom_mol_wt": 143.951,
                "nhoh_count": 1,
                "no_count": 2,
                "num_h_acceptors": 1,
                "num_h_donors": 1,
                "num_het_atoms": 3,
                "num_rot_bonds": 0,
                "num_val_electrons": 32,
                "ring_count": 1,
                "tpsa": 28.68
            }
        },
        "well": "A1",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1028,
            "code": "NCL-00023818",
            "smiles": "IC1=CNN=C1",
            "properties": {
                "log_p": 1.0143,
                "mol_wt": 193.934096096,
                "heavy_atom_count": 6,
                "heavy_atom_mol_wt": 190.951,
                "nhoh_count": 1,
                "no_count": 2,
                "num_h_acceptors": 1,
                "num_h_donors": 1,
                "num_het_atoms": 3,
                "num_rot_bonds": 0,
                "num_val_electrons": 32,
                "ring_count": 1,
                "tpsa": 28.68
            }
        },
        "well": "A2",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1029,
            "code": "NCL-00023820",
            "smiles": "BrC1=CON=C1",
            "properties": {
                "log_p": 1.4370999999999998,
                "mol_wt": 146.931975784,
                "heavy_atom_count": 6,
                "heavy_atom_mol_wt": 145.94299999999998,
                "nhoh_count": 0,
                "no_count": 2,
                "num_h_acceptors": 2,
                "num_h_donors": 0,
                "num_het_atoms": 3,
                "num_rot_bonds": 0,
                "num_val_electrons": 32,
                "ring_count": 1,
                "tpsa": 26.03
            }
        },
        "well": "A3",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1030,
            "code": "NCL-00023823",
            "smiles": "NC1=NC=CC(Br)=C1",
            "properties": {
                "log_p": 1.4263,
                "mol_wt": 171.96361026,
                "heavy_atom_count": 8,
                "heavy_atom_mol_wt": 167.97299999999998,
                "nhoh_count": 2,
                "no_count": 2,
                "num_h_acceptors": 2,
                "num_h_donors": 1,
                "num_het_atoms": 3,
                "num_rot_bonds": 0,
                "num_val_electrons": 42,
                "ring_count": 1,
                "tpsa": 38.91
            }
        },
        "well": "A4",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1031,
            "code": "NCL-00023822",
            "smiles": "NC1=NC=CC(I)=C1",
            "properties": {
                "log_p": 1.2684,
                "mol_wt": 219.94974616,
                "heavy_atom_count": 8,
                "heavy_atom_mol_wt": 214.97299999999998,
                "nhoh_count": 2,
                "no_count": 2,
                "num_h_acceptors": 2,
                "num_h_donors": 1,
                "num_het_atoms": 3,
                "num_rot_bonds": 0,
                "num_val_electrons": 42,
                "ring_count": 1,
                "tpsa": 38.91
            }
        },
        "well": "A5",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1032,
            "code": "NCL-00023825",
            "smiles": "O=C1C=C(Br)C=CN1",
            "properties": {
                "log_p": 1.1374,
                "mol_wt": 172.947625848,
                "heavy_atom_count": 8,
                "heavy_atom_mol_wt": 169.96499999999997,
                "nhoh_count": 1,
                "no_count": 2,
                "num_h_acceptors": 1,
                "num_h_donors": 1,
                "num_het_atoms": 3,
                "num_rot_bonds": 0,
                "num_val_electrons": 42,
                "ring_count": 1,
                "tpsa": 32.86
            }
        },
        "well": "A6",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1033,
            "code": "NCL-00023824",
            "smiles": "O=C1C=C(I)C=CN1",
            "properties": {
                "log_p": 0.9795,
                "mol_wt": 220.933761748,
                "heavy_atom_count": 8,
                "heavy_atom_mol_wt": 216.96499999999997,
                "nhoh_count": 1,
                "no_count": 2,
                "num_h_acceptors": 1,
                "num_h_donors": 1,
                "num_het_atoms": 3,
                "num_rot_bonds": 0,
                "num_val_electrons": 42,
                "ring_count": 1,
                "tpsa": 32.86
            }
        },
        "well": "A7",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1034,
            "code": "NCL-00023830",
            "smiles": "BrC1=CC=C(S(N)(=O)=O)C=C1",
            "properties": {
                "log_p": 1.0965,
                "mol_wt": 234.930261532,
                "heavy_atom_count": 11,
                "heavy_atom_mol_wt": 230.04199999999997,
                "nhoh_count": 2,
                "no_count": 3,
                "num_h_acceptors": 2,
                "num_h_donors": 1,
                "num_het_atoms": 5,
                "num_rot_bonds": 1,
                "num_val_electrons": 60,
                "ring_count": 1,
                "tpsa": 60.160000000000004
            }
        },
        "well": "A8",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1035,
            "code": "NCL-00023829",
            "smiles": "IC1=CC=C(S(N)(=O)=O)C=C1",
            "properties": {
                "log_p": 0.9386000000000001,
                "mol_wt": 282.916397432,
                "heavy_atom_count": 11,
                "heavy_atom_mol_wt": 277.04200000000003,
                "nhoh_count": 2,
                "no_count": 3,
                "num_h_acceptors": 2,
                "num_h_donors": 1,
                "num_het_atoms": 5,
                "num_rot_bonds": 1,
                "num_val_electrons": 60,
                "ring_count": 1,
                "tpsa": 60.160000000000004
            }
        },
        "well": "A9",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1036,
            "code": "NCL-00023827",
            "smiles": "O=C1CC2=C(C=C(Br)C=C2)N1",
            "properties": {
                "log_p": 1.9436999999999995,
                "mol_wt": 210.963275912,
                "heavy_atom_count": 11,
                "heavy_atom_mol_wt": 205.998,
                "nhoh_count": 1,
                "no_count": 2,
                "num_h_acceptors": 1,
                "num_h_donors": 1,
                "num_het_atoms": 3,
                "num_rot_bonds": 0,
                "num_val_electrons": 56,
                "ring_count": 2,
                "tpsa": 29.1
            }
        },
        "well": "A10",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1037,
            "code": "NCL-00023828",
            "smiles": "BrC1=CC=C(NC(C)=O)C=C1",
            "properties": {
                "log_p": 2.4074999999999998,
                "mol_wt": 212.978925976,
                "heavy_atom_count": 11,
                "heavy_atom_mol_wt": 205.99799999999996,
                "nhoh_count": 1,
                "no_count": 2,
                "num_h_acceptors": 1,
                "num_h_donors": 1,
                "num_het_atoms": 3,
                "num_rot_bonds": 1,
                "num_val_electrons": 58,
                "ring_count": 1,
                "tpsa": 29.1
            }
        },
        "well": "A11",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1038,
            "code": "NCL-00023826",
            "smiles": "IC1=CC=C(C(N)=O)C=C1",
            "properties": {
                "log_p": 1.3901,
                "mol_wt": 246.949411812,
                "heavy_atom_count": 10,
                "heavy_atom_mol_wt": 240.98699999999997,
                "nhoh_count": 2,
                "no_count": 2,
                "num_h_acceptors": 1,
                "num_h_donors": 1,
                "num_het_atoms": 3,
                "num_rot_bonds": 1,
                "num_val_electrons": 52,
                "ring_count": 1,
                "tpsa": 43.09
            }
        },
        "well": "A12",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1039,
            "code": "NCL-00023832",
            "smiles": "BrC1=CN=CN=C1",
            "properties": {
                "log_p": 1.2390999999999999,
                "mol_wt": 157.947960196,
                "heavy_atom_count": 7,
                "heavy_atom_mol_wt": 155.962,
                "nhoh_count": 0,
                "no_count": 2,
                "num_h_acceptors": 2,
                "num_h_donors": 0,
                "num_het_atoms": 3,
                "num_rot_bonds": 0,
                "num_val_electrons": 36,
                "ring_count": 1,
                "tpsa": 25.78
            }
        },
        "well": "A13",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1040,
            "code": "NCL-00023831",
            "smiles": "IC1=CN=CN=C1",
            "properties": {
                "log_p": 1.0812,
                "mol_wt": 205.934096096,
                "heavy_atom_count": 7,
                "heavy_atom_mol_wt": 202.962,
                "nhoh_count": 0,
                "no_count": 2,
                "num_h_acceptors": 2,
                "num_h_donors": 0,
                "num_het_atoms": 3,
                "num_rot_bonds": 0,
                "num_val_electrons": 36,
                "ring_count": 1,
                "tpsa": 25.78
            }
        },
        "well": "A14",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1041,
            "code": "NCL-00023836",
            "smiles": "BrC1=CC(OC)=NC=C1",
            "properties": {
                "log_p": 1.8527,
                "mol_wt": 186.963275912,
                "heavy_atom_count": 9,
                "heavy_atom_mol_wt": 181.97599999999997,
                "nhoh_count": 0,
                "no_count": 2,
                "num_h_acceptors": 2,
                "num_h_donors": 0,
                "num_het_atoms": 3,
                "num_rot_bonds": 1,
                "num_val_electrons": 48,
                "ring_count": 1,
                "tpsa": 22.12
            }
        },
        "well": "A15",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1042,
            "code": "NCL-00023833",
            "smiles": "BrC1=CC=NC2=NC=CC=C21",
            "properties": {
                "log_p": 2.3922999999999996,
                "mol_wt": 207.96361026,
                "heavy_atom_count": 11,
                "heavy_atom_mol_wt": 204.00599999999997,
                "nhoh_count": 0,
                "no_count": 2,
                "num_h_acceptors": 2,
                "num_h_donors": 0,
                "num_het_atoms": 3,
                "num_rot_bonds": 0,
                "num_val_electrons": 54,
                "ring_count": 2,
                "tpsa": 25.78
            }
        },
        "well": "A16",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1043,
            "code": "NCL-00023835",
            "smiles": "BrC1=CC=C(S(C)(=O)=O)C=C1",
            "properties": {
                "log_p": 1.8526000000000002,
                "mol_wt": 233.935012564,
                "heavy_atom_count": 11,
                "heavy_atom_mol_wt": 228.04599999999996,
                "nhoh_count": 0,
                "no_count": 2,
                "num_h_acceptors": 2,
                "num_h_donors": 0,
                "num_het_atoms": 4,
                "num_rot_bonds": 1,
                "num_val_electrons": 60,
                "ring_count": 1,
                "tpsa": 34.14
            }
        },
        "well": "A17",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1044,
            "code": "NCL-00024670",
            "smiles": "BrC1=CC(CO)=NC=C1",
            "properties": {
                "log_p": 1.3363999999999998,
                "mol_wt": 186.963275912,
                "heavy_atom_count": 9,
                "heavy_atom_mol_wt": 181.97599999999997,
                "nhoh_count": 1,
                "no_count": 2,
                "num_h_acceptors": 2,
                "num_h_donors": 1,
                "num_het_atoms": 3,
                "num_rot_bonds": 1,
                "num_val_electrons": 48,
                "ring_count": 1,
                "tpsa": 33.120000000000005
            }
        },
        "well": "A18",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1045,
            "code": "NCL-00024774",
            "smiles": "OC1=C(OC)C=C(Br)C=C1",
            "properties": {
                "log_p": 2.1632999999999996,
                "mol_wt": 201.962941564,
                "heavy_atom_count": 10,
                "heavy_atom_mol_wt": 195.97899999999998,
                "nhoh_count": 1,
                "no_count": 2,
                "num_h_acceptors": 2,
                "num_h_donors": 1,
                "num_het_atoms": 3,
                "num_rot_bonds": 1,
                "num_val_electrons": 54,
                "ring_count": 1,
                "tpsa": 29.46
            }
        },
        "well": "A19",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1046,
            "code": "NCL-00024674",
            "smiles": "BrC1=CC(COC)=NC=C1",
            "properties": {
                "log_p": 1.9904999999999997,
                "mol_wt": 200.978925976,
                "heavy_atom_count": 10,
                "heavy_atom_mol_wt": 193.98699999999997,
                "nhoh_count": 0,
                "no_count": 2,
                "num_h_acceptors": 2,
                "num_h_donors": 0,
                "num_het_atoms": 3,
                "num_rot_bonds": 2,
                "num_val_electrons": 54,
                "ring_count": 1,
                "tpsa": 22.12
            }
        },
        "well": "A20",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1047,
            "code": "NCL-00024661",
            "smiles": "OC1=C(C#N)C=C(Br)C=C1",
            "properties": {
                "log_p": 2.0263799999999996,
                "mol_wt": 196.947625848,
                "heavy_atom_count": 10,
                "heavy_atom_mol_wt": 193.98699999999997,
                "nhoh_count": 1,
                "no_count": 2,
                "num_h_acceptors": 2,
                "num_h_donors": 1,
                "num_het_atoms": 3,
                "num_rot_bonds": 0,
                "num_val_electrons": 50,
                "ring_count": 1,
                "tpsa": 44.019999999999996
            }
        },
        "well": "A21",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1048,
            "code": "NCL-00024662",
            "smiles": "BrC1=CC(OC)=C(CO)C=C1",
            "properties": {
                "log_p": 1.9499999999999997,
                "mol_wt": 215.978591628,
                "heavy_atom_count": 11,
                "heavy_atom_mol_wt": 207.98999999999995,
                "nhoh_count": 1,
                "no_count": 2,
                "num_h_acceptors": 2,
                "num_h_donors": 1,
                "num_het_atoms": 3,
                "num_rot_bonds": 2,
                "num_val_electrons": 60,
                "ring_count": 1,
                "tpsa": 29.46
            }
        },
        "well": "A22",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1049,
            "code": "NCL-00024671",
            "smiles": "BrC1=CN(CCO)N=C1",
            "properties": {
                "log_p": 0.6378999999999999,
                "mol_wt": 189.974174944,
                "heavy_atom_count": 9,
                "heavy_atom_mol_wt": 183.97199999999998,
                "nhoh_count": 1,
                "no_count": 3,
                "num_h_acceptors": 3,
                "num_h_donors": 1,
                "num_het_atoms": 4,
                "num_rot_bonds": 2,
                "num_val_electrons": 50,
                "ring_count": 1,
                "tpsa": 38.05
            }
        },
        "well": "A23",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1050,
            "code": "NCL-00024667",
            "smiles": "BrC1=CC(O)=C(C(O)=O)C=C1",
            "properties": {
                "log_p": 1.8529,
                "mol_wt": 215.94220612,
                "heavy_atom_count": 11,
                "heavy_atom_mol_wt": 211.97799999999995,
                "nhoh_count": 2,
                "no_count": 3,
                "num_h_acceptors": 2,
                "num_h_donors": 2,
                "num_het_atoms": 4,
                "num_rot_bonds": 1,
                "num_val_electrons": 58,
                "ring_count": 1,
                "tpsa": 57.53
            }
        },
        "well": "A24",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1051,
            "code": "NCL-00024663",
            "smiles": "BrC1=CC(C#N)=C(OC)C=C1",
            "properties": {
                "log_p": 2.3293800000000005,
                "mol_wt": 210.963275912,
                "heavy_atom_count": 11,
                "heavy_atom_mol_wt": 205.99799999999996,
                "nhoh_count": 0,
                "no_count": 2,
                "num_h_acceptors": 2,
                "num_h_donors": 0,
                "num_het_atoms": 3,
                "num_rot_bonds": 1,
                "num_val_electrons": 56,
                "ring_count": 1,
                "tpsa": 33.019999999999996
            }
        },
        "well": "B1",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1052,
            "code": "NCL-00024673",
            "smiles": "BrC1=CN(CCOC)N=C1",
            "properties": {
                "log_p": 1.2919999999999998,
                "mol_wt": 203.989825008,
                "heavy_atom_count": 10,
                "heavy_atom_mol_wt": 195.98299999999998,
                "nhoh_count": 0,
                "no_count": 3,
                "num_h_acceptors": 3,
                "num_h_donors": 0,
                "num_het_atoms": 4,
                "num_rot_bonds": 3,
                "num_val_electrons": 56,
                "ring_count": 1,
                "tpsa": 27.05
            }
        },
        "well": "B2",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1053,
            "code": "NCL-00024890",
            "smiles": "BrC1=CN(CC(O)=O)N=C1",
            "properties": {
                "log_p": 0.7302,
                "mol_wt": 203.9534395,
                "heavy_atom_count": 10,
                "heavy_atom_mol_wt": 199.97099999999998,
                "nhoh_count": 1,
                "no_count": 4,
                "num_h_acceptors": 3,
                "num_h_donors": 1,
                "num_het_atoms": 5,
                "num_rot_bonds": 2,
                "num_val_electrons": 54,
                "ring_count": 1,
                "tpsa": 55.120000000000005
            }
        },
        "well": "B3",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1054,
            "code": "NCL-00024672",
            "smiles": "O=C1N(CCO)C=CC(Br)=C1",
            "properties": {
                "log_p": 0.6030999999999995,
                "mol_wt": 216.973840596,
                "heavy_atom_count": 11,
                "heavy_atom_mol_wt": 209.98599999999996,
                "nhoh_count": 1,
                "no_count": 3,
                "num_h_acceptors": 3,
                "num_h_donors": 1,
                "num_het_atoms": 4,
                "num_rot_bonds": 2,
                "num_val_electrons": 60,
                "ring_count": 1,
                "tpsa": 42.230000000000004
            }
        },
        "well": "B4",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1055,
            "code": "NCL-00024387",
            "smiles": "O=C1N(CCOC)C=CC(Br)=C1",
            "properties": {
                "log_p": 1.2571999999999997,
                "mol_wt": 230.98949066,
                "heavy_atom_count": 12,
                "heavy_atom_mol_wt": 221.99699999999996,
                "nhoh_count": 0,
                "no_count": 3,
                "num_h_acceptors": 3,
                "num_h_donors": 0,
                "num_het_atoms": 4,
                "num_rot_bonds": 3,
                "num_val_electrons": 66,
                "ring_count": 1,
                "tpsa": 31.23
            }
        },
        "well": "B5",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1056,
            "code": "NCL-00024773",
            "smiles": "O=C1N(CC(O)=O)C=CC(Br)=C1",
            "properties": {
                "log_p": 0.6953999999999997,
                "mol_wt": 230.953105152,
                "heavy_atom_count": 12,
                "heavy_atom_mol_wt": 225.98499999999996,
                "nhoh_count": 1,
                "no_count": 4,
                "num_h_acceptors": 3,
                "num_h_donors": 1,
                "num_het_atoms": 5,
                "num_rot_bonds": 2,
                "num_val_electrons": 64,
                "ring_count": 1,
                "tpsa": 59.300000000000004
            }
        },
        "well": "B6",
        "concentration": 100
    },
    {
        "compound": {
            "id": 1057,
            "code": "NCL-00024665",
            "smiles": "BrC1=CC(OC)=C(CC(O)=O)C=C1",
            "properties": {
                "log_p": 2.0848,
                "mol_wt": 243.973506248,
                "heavy_atom_count": 13,
                "heavy_atom_mol_wt": 235.99999999999994,
                "nhoh_count": 1,
                "no_count": 3,
                "num_h_acceptors": 2,
                "num_h_donors": 1,
                "num_het_atoms": 4,
                "num_rot_bonds": 3,
                "num_val_electrons": 70,
                "ring_count": 1,
                "tpsa": 46.53
            }
        },
        "well": "B7",
        "concentration": 100
    }
]

export const fraglites = {
        "id": 9,
        "library": {
            "id": 3,
            "name": "FragLite",
            "for_industry": false,
            "public": true
        },
        "barcode": "test-plate",
        "current": true,
        "size": 31,
        "compounds" : flCompounds
    }

const plCompounds = [
    {
        "compound": {
            "id": 2097,
            "code": "NCL-00025345",
            "smiles": "CC(=O)NCC(=O)NCC#CBr",
            "properties": {
                "log_p": -0.40549999999999975,
                "mol_wt": 231.984739628,
                "heavy_atom_count": 12,
                "heavy_atom_mol_wt": 223.993,
                "nhoh_count": 2,
                "no_count": 4,
                "num_h_acceptors": 2,
                "num_h_donors": 2,
                "num_het_atoms": 5,
                "num_rot_bonds": 3,
                "num_val_electrons": 66,
                "ring_count": 0,
                "tpsa": 58.2
            }
        },
        "well": "A1",
        "concentration": 500
    },
    {
        "compound": {
            "id": 2098,
            "code": "NCL-00024897",
            "smiles": "CC([C@@H](C(NCC#CBr)=O)NC(C)=O)C",
            "properties": {
                "log_p": 0.6190999999999998,
                "mol_wt": 274.03168982000005,
                "heavy_atom_count": 15,
                "heavy_atom_mol_wt": 260.026,
                "nhoh_count": 2,
                "no_count": 4,
                "num_h_acceptors": 2,
                "num_h_donors": 2,
                "num_het_atoms": 5,
                "num_rot_bonds": 4,
                "num_val_electrons": 84,
                "ring_count": 0,
                "tpsa": 58.2
            }
        },
        "well": "A2",
        "concentration": 500
    },
    {
        "compound": {
            "id": 2099,
            "code": "NCL-00024905",
            "smiles": "CC(N[C@H](C(NCC#CBr)=O)Cc1ccc(O)cc1)=O",
            "properties": {
                "log_p": 0.9114,
                "mol_wt": 338.02660443999997,
                "heavy_atom_count": 20,
                "heavy_atom_mol_wt": 324.0690000000001,
                "nhoh_count": 3,
                "no_count": 5,
                "num_h_acceptors": 3,
                "num_h_donors": 3,
                "num_het_atoms": 6,
                "num_rot_bonds": 5,
                "num_val_electrons": 106,
                "ring_count": 1,
                "tpsa": 78.43
            }
        },
        "well": "A3",
        "concentration": 500
    },
    {
        "compound": {
            "id": 2100,
            "code": "NCL-00024976",
            "smiles": "CC[C@@H]([C@@H](C(NCC#CBr)=O)NC(C)=O)C",
            "properties": {
                "log_p": 1.0091999999999999,
                "mol_wt": 288.047339884,
                "heavy_atom_count": 16,
                "heavy_atom_mol_wt": 272.037,
                "nhoh_count": 2,
                "no_count": 4,
                "num_h_acceptors": 2,
                "num_h_donors": 2,
                "num_het_atoms": 5,
                "num_rot_bonds": 5,
                "num_val_electrons": 90,
                "ring_count": 0,
                "tpsa": 58.2
            }
        },
        "well": "A4",
        "concentration": 500
    },
    {
        "compound": {
            "id": 2101,
            "code": "NCL-00024907",
            "smiles": "CC(=O)N[C@@H](Cc1ccccc1)C(=O)NCC#CBr",
            "properties": {
                "log_p": 1.2058,
                "mol_wt": 322.03168982000005,
                "heavy_atom_count": 19,
                "heavy_atom_mol_wt": 308.06999999999994,
                "nhoh_count": 2,
                "no_count": 4,
                "num_h_acceptors": 2,
                "num_h_donors": 2,
                "num_het_atoms": 5,
                "num_rot_bonds": 5,
                "num_val_electrons": 100,
                "ring_count": 1,
                "tpsa": 58.2
            }
        },
        "well": "A5",
        "concentration": 500
    },
    {
        "compound": {
            "id": 2102,
            "code": "NCL-00024977",
            "smiles": "CC(=O)N1CCC[C@H]1C(=O)NCC#CBr",
            "properties": {
                "log_p": 0.4693000000000001,
                "mol_wt": 272.01603975600005,
                "heavy_atom_count": 15,
                "heavy_atom_mol_wt": 260.02599999999995,
                "nhoh_count": 1,
                "no_count": 4,
                "num_h_acceptors": 2,
                "num_h_donors": 1,
                "num_het_atoms": 5,
                "num_rot_bonds": 2,
                "num_val_electrons": 82,
                "ring_count": 1,
                "tpsa": 49.410000000000004
            }
        },
        "well": "A6",
        "concentration": 500
    },
    {
        "compound": {
            "id": 2103,
            "code": "NCL-00024978",
            "smiles": "CC(=O)N[C@@H](CCCCN)C(=O)NCC#CBr",
            "properties": {
                "log_p": 0.09210000000000063,
                "mol_wt": 303.058238916,
                "heavy_atom_count": 17,
                "heavy_atom_mol_wt": 286.044,
                "nhoh_count": 4,
                "no_count": 5,
                "num_h_acceptors": 3,
                "num_h_donors": 3,
                "num_het_atoms": 6,
                "num_rot_bonds": 7,
                "num_val_electrons": 96,
                "ring_count": 0,
                "tpsa": 84.22
            }
        },
        "well": "A7",
        "concentration": 500
    },
    {
        "compound": {
            "id": 2104,
            "code": "NCL-00024979",
            "smiles": "O=C(C)N[C@H](C(NCC#CBr)=O)CCSC",
            "properties": {
                "log_p": 0.7162,
                "mol_wt": 306.00376082,
                "heavy_atom_count": 16,
                "heavy_atom_mol_wt": 292.093,
                "nhoh_count": 2,
                "no_count": 4,
                "num_h_acceptors": 3,
                "num_h_donors": 2,
                "num_het_atoms": 6,
                "num_rot_bonds": 6,
                "num_val_electrons": 90,
                "ring_count": 0,
                "tpsa": 58.2
            }
        },
        "well": "A8",
        "concentration": 500
    },
    {
        "compound": {
            "id": 2105,
            "code": "NCL-00025057",
            "smiles": "CC(=O)N[C@@H](CO)C(=O)NCC#CBr",
            "properties": {
                "log_p": -1.0446000000000002,
                "mol_wt": 261.99530431200003,
                "heavy_atom_count": 14,
                "heavy_atom_mol_wt": 252.00299999999996,
                "nhoh_count": 3,
                "no_count": 5,
                "num_h_acceptors": 3,
                "num_h_donors": 3,
                "num_het_atoms": 6,
                "num_rot_bonds": 4,
                "num_val_electrons": 78,
                "ring_count": 0,
                "tpsa": 78.43
            }
        },
        "well": "A9",
        "concentration": 500
    },
    {
        "compound": {
            "id": 2106,
            "code": "NCL-00025058",
            "smiles": "C[C@H]([C@@H](C(NCC#CBr)=O)NC(C)=O)O",
            "properties": {
                "log_p": -0.6560999999999999,
                "mol_wt": 276.01095437600003,
                "heavy_atom_count": 15,
                "heavy_atom_mol_wt": 264.014,
                "nhoh_count": 3,
                "no_count": 5,
                "num_h_acceptors": 3,
                "num_h_donors": 3,
                "num_het_atoms": 6,
                "num_rot_bonds": 4,
                "num_val_electrons": 84,
                "ring_count": 0,
                "tpsa": 78.43
            }
        },
        "well": "A10",
        "concentration": 500
    },
    {
        "compound": {
            "id": 2107,
            "code": "NCL-00025059",
            "smiles": "CC(=O)N[C@@H](CCC(=O)O)C(=O)NCC#CBr",
            "properties": {
                "log_p": -0.17209999999999964,
                "mol_wt": 304.005868996,
                "heavy_atom_count": 17,
                "heavy_atom_mol_wt": 292.024,
                "nhoh_count": 3,
                "no_count": 6,
                "num_h_acceptors": 3,
                "num_h_donors": 3,
                "num_het_atoms": 7,
                "num_rot_bonds": 6,
                "num_val_electrons": 94,
                "ring_count": 0,
                "tpsa": 95.5
            }
        },
        "well": "A11",
        "concentration": 500
    },
    {
        "compound": {
            "id": 2108,
            "code": "NCL-00025065",
            "smiles": "CC(=O)N[C@@H](CCC(=O)N)C(=O)NCC#CBr",
            "properties": {
                "log_p": -0.7713999999999992,
                "mol_wt": 303.021853408,
                "heavy_atom_count": 17,
                "heavy_atom_mol_wt": 290.0319999999999,
                "nhoh_count": 4,
                "no_count": 6,
                "num_h_acceptors": 3,
                "num_h_donors": 3,
                "num_het_atoms": 7,
                "num_rot_bonds": 6,
                "num_val_electrons": 94,
                "ring_count": 0,
                "tpsa": 101.28999999999999
            }
        },
        "well": "A12",
        "concentration": 500
    },
    {
        "compound": {
            "id": 2109,
            "code": "NCL-00025067",
            "smiles": "C[C@H](NC(=O)C)C(=O)NCC#CBr",
            "properties": {
                "log_p": -0.016999999999999627,
                "mol_wt": 246.000389692,
                "heavy_atom_count": 13,
                "heavy_atom_mol_wt": 236.00399999999996,
                "nhoh_count": 2,
                "no_count": 4,
                "num_h_acceptors": 2,
                "num_h_donors": 2,
                "num_het_atoms": 5,
                "num_rot_bonds": 3,
                "num_val_electrons": 72,
                "ring_count": 0,
                "tpsa": 58.2
            }
        },
        "well": "A13",
        "concentration": 500
    },
    {
        "compound": {
            "id": 2110,
            "code": "NCL-00025066",
            "smiles": "CC(=O)NCCCC[C@H](NC(=O)C)C(=O)NCC#CBr",
            "properties": {
                "log_p": 0.26950000000000035,
                "mol_wt": 345.0688036,
                "heavy_atom_count": 20,
                "heavy_atom_mol_wt": 326.06499999999994,
                "nhoh_count": 3,
                "no_count": 6,
                "num_h_acceptors": 3,
                "num_h_donors": 3,
                "num_het_atoms": 7,
                "num_rot_bonds": 8,
                "num_val_electrons": 112,
                "ring_count": 0,
                "tpsa": 87.30000000000001
            }
        },
        "well": "A14",
        "concentration": 500
    },
    {
        "compound": {
            "id": 2111,
            "code": "NCL-00025267",
            "smiles": "CC(=O)NCCCC[C@H](NC(=O)C)C(=O)NCc1ccc(cc1)Br",
            "properties": {
                "log_p": 1.8764000000000005,
                "mol_wt": 397.100103728,
                "heavy_atom_count": 24,
                "heavy_atom_mol_wt": 374.10900000000004,
                "nhoh_count": 3,
                "no_count": 6,
                "num_h_acceptors": 3,
                "num_h_donors": 3,
                "num_het_atoms": 7,
                "num_rot_bonds": 9,
                "num_val_electrons": 132,
                "ring_count": 1,
                "tpsa": 87.30000000000001
            }
        },
        "well": "A15",
        "concentration": 500
    },
    {
        "compound": {
            "id": 3017,
            "code": "NCL-00025412",
            "smiles": "CC(N[C@H](C(NCC#CBr)=O)CC(N)=O)=O",
            "properties": {
                "log_p": -1.1614999999999993,
                "mol_wt": 289.00620334399997,
                "heavy_atom_count": 16,
                "heavy_atom_mol_wt": 278.021,
                "nhoh_count": 4,
                "no_count": 6,
                "num_h_acceptors": 3,
                "num_h_donors": 3,
                "num_het_atoms": 7,
                "num_rot_bonds": 5,
                "num_val_electrons": 88,
                "ring_count": 0,
                "tpsa": 101.28999999999999
            }
        },
        "well": "A16",
        "concentration": 500
    },
    {
        "compound": {
            "id": 2113,
            "code": "NCL-00025413",
            "smiles": "CC(N[C@H](C(NCC#CBr)=O)CC(O)=O)=O",
            "properties": {
                "log_p": -0.5622000000000003,
                "mol_wt": 289.990218932,
                "heavy_atom_count": 16,
                "heavy_atom_mol_wt": 280.013,
                "nhoh_count": 3,
                "no_count": 6,
                "num_h_acceptors": 3,
                "num_h_donors": 3,
                "num_het_atoms": 7,
                "num_rot_bonds": 5,
                "num_val_electrons": 88,
                "ring_count": 0,
                "tpsa": 95.5
            }
        },
        "well": "A17",
        "concentration": 500
    },
    {
        "compound": {
            "id": 3018,
            "code": "NCL-00024906",
            "smiles": "CC(N[C@@H](CC(C)C)C(NCC#CBr)=O)=O",
            "properties": {
                "log_p": 1.0092,
                "mol_wt": 288.047339884,
                "heavy_atom_count": 16,
                "heavy_atom_mol_wt": 272.037,
                "nhoh_count": 2,
                "no_count": 4,
                "num_h_acceptors": 2,
                "num_h_donors": 2,
                "num_het_atoms": 5,
                "num_rot_bonds": 5,
                "num_val_electrons": 90,
                "ring_count": 0,
                "tpsa": 58.199999999999996
            }
        },
        "well": "A18",
        "concentration": 500
    },
    {
        "compound": {
            "id": 3019,
            "code": "NCL-00024982",
            "smiles": "CC(N[C@@H](CC1=CNC2=C1C=CC=C2)C(NCC#CBr)=O)=O",
            "properties": {
                "log_p": 1.6870999999999998,
                "mol_wt": 361.04258885199994,
                "heavy_atom_count": 22,
                "heavy_atom_mol_wt": 346.099,
                "nhoh_count": 3,
                "no_count": 5,
                "num_h_acceptors": 2,
                "num_h_donors": 3,
                "num_het_atoms": 6,
                "num_rot_bonds": 5,
                "num_val_electrons": 114,
                "ring_count": 2,
                "tpsa": 73.99000000000001
            }
        },
        "well": "A19",
        "concentration": 500
    },
    {
        "compound": {
            "id": 3020,
            "code": "NCL-00024978-002",
            "smiles": "CC(N[C@@H](CCCC[NH3+])C(NCC#CBr)=O)=O.O=C([O-])C(F)(F)F",
            "properties": {
                "log_p": -1.3260999999999963,
                "mol_wt": 417.0511028479999,
                "heavy_atom_count": 24,
                "heavy_atom_mol_wt": 399.05800000000005,
                "nhoh_count": 5,
                "no_count": 7,
                "num_h_acceptors": 4,
                "num_h_donors": 3,
                "num_het_atoms": 11,
                "num_rot_bonds": 7,
                "num_val_electrons": 138,
                "ring_count": 0,
                "tpsa": 125.97
            }
        },
        "well": "A20",
        "concentration": 500
    },
    {
        "compound": {
            "id": 3021,
            "code": "NCL-00025550",
            "smiles": "CC(N[C@@H](CC1=C[NH2+]C=N1)C(NCC#CBr)=O)=O.O=C([O-])C(F)(F)F",
            "properties": {
                "log_p": -1.901499999999997,
                "mol_wt": 426.01505168799986,
                "heavy_atom_count": 25,
                "heavy_atom_mol_wt": 413.0650000000001,
                "nhoh_count": 4,
                "no_count": 8,
                "num_h_acceptors": 5,
                "num_h_donors": 3,
                "num_het_atoms": 12,
                "num_rot_bonds": 5,
                "num_val_electrons": 138,
                "ring_count": 1,
                "tpsa": 127.29999999999998
            }
        },
        "well": "A21",
        "concentration": 500
    },
    {
        "compound": {
            "id": 3022,
            "code": "NCL-00025551",
            "smiles": "CC(N[C@@H](CCCNC(N)=N)C(NCC#CBr)=O)=O.O=C([O-])C(F)(F)F",
            "properties": {
                "log_p": -1.475029999999998,
                "mol_wt": 444.0499743959099,
                "heavy_atom_count": 26,
                "heavy_atom_mol_wt": 427.07200000000006,
                "nhoh_count": 6,
                "no_count": 9,
                "num_h_acceptors": 5,
                "num_h_donors": 5,
                "num_het_atoms": 13,
                "num_rot_bonds": 7,
                "num_val_electrons": 148,
                "ring_count": 0,
                "tpsa": 160.23
            }
        },
        "well": "A22",
        "concentration": 500
    }
]

export const peplite =  {
        "id": 23,
        "library": {
            "id": 14,
            "name": "PepLite",
            "for_industry": false,
            "public": true
        },
        "barcode": "plate-2",
        "current": true,
        "size": 22,
        "compounds": plCompounds
    }
    
export const proposal = {
    'proposal' : 'fakeProposal',
    'libraries' : [9, 23],
    'subsets' : []
}

export const sel = [fraglites, peplite]; 

export default combinations;
