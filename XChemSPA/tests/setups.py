from API.models import (
    CrystalPlate, 
    Library, 
    LibraryPlate, 
    LibrarySubset, 
    Compounds, 
    SourceWell, 
    Preset, 
    Proposals, 
    SpaCompound,
    Crystal,
    Batch,
    Lab
)

libraries_data = [("lib1", True, True), ("lib2", False, True), ("lib3", True, False)]
plates_data = [("xyz-current", 0, True), ("xyz-old1", 0, False), ("xyz-old2", 0, False), ("own-plate", 1, True), ("abc", 2, True)]
compounds_data = [
    ("code1", "CC"), ("code2", "CCO"), ("code3", "CCI"), ("code4", "CCF"), 
    ("code5", ""),  ("code6", ""),  ("code7", ""), 
    ("code8", "CCC"), ("code9", "CCCFO"), ("code10", "CCFC"), ]

source_wells_data = [
    (1, 0, "A01", 30, True), (2, 0, "B01", 30, True), (3, 0, "C01", 30, True), (0, 0, "D01", 30, True),
    (1, 1, "A01", 30, False), (2, 1, "B01", 30, True), (3, 1, "C01", 30, False), (0, 1, "D01", 30, True), 
    (1, 2, "A01", 30, True), (2, 2, "B01", 30, True), (3, 2, "C01", 30, False), (0, 2, "D01", 30, True),
    (4, 3 ,"A01", 30, True), (5, 3, "B01", 30, True), (6, 3, "C01", 30, False),
    (7, 4, "C01", True), (8, 4, "C04", False), (9, 4, "C11", True)
    ]

subsets_data = [("lib1-s1", 0, [1, 2]), ("lib1-s2", 0, [0, 3]), ("lib3-s1", 2, [7]), ("lib3-s2", 2, [7, 9]), ]

proposals_data = [("proposal1", [0], [0, 1]), ("proposal2", [2], [])]

crystal_plate_data = [("barcode1", "30", "SwissCI-3drop", "visit-1"), ("barcode2", "50", "SwissCI-3drop", "visit-1")]

spa_compound_data = [
    ("visit-1", "libname", "barcode", "A1", "code1", "CC"), 
    ("visit-1", "libname", "barcode", "B2", "code2", "CCO"), 
    ("visit-1", "libname", "barcode", "C5", "code3", "CCI"), 
    ("visit-1", "libname", "barcode", "C7", "code4", "CCF"), 
    ("visit-1", "libname", "barcode", "C9", "code5", ""),  
    ("visit-1", "libname", "barcode", "F12", "code6", ""),  
    ("visit-1", "libname", "barcode", "K09", "code7", ""), 
    ("visit-1", "libname", "barcode", "L9", "code8", "CCC"), 
    ("visit-1", "libname", "barcode", "AB08", "code9", "CCCFO"), 
    ("visit-1", "libname", "barcode", "K2", "code10", "CCFC"), 
    ]

crystal_data = [
    ("visit-1", "A01a", 12, 450, 6, 'name1'), ("visit-1", "A01d", 100, -450, 6, 'name2'),
    ("visit-1", "A03a", 0, -25, 6, 'name3'), ("visit-1", "B10c", 812, 450, 6, ''),
]
batch_data = [
    (1, 'visit-1', 0), (2, 'visit-1', 0)
]
lab_data = [
    (0, 0, 0, "visit-1"), (1, 1, 0, 'visit-1'), (2, 2, 0, 'visit-1')
]

def set_up_libraries(data):
    libs = []
    for t in data:
        l =  Library.objects.create(name=t[0], public=t[1], for_industry=t[2])
        libs.append(l)
    return libs

def set_up_library_plates(data, library_data):
    libraries = Library.objects.all()
    if libraries.count() == 0:
        libraries = set_up_libraries(library_data)
    plates = []
    for t in data:
        p = LibraryPlate.objects.create(barcode=t[0], library=libraries[t[1]], current=t[2])
        plates.append(p)
    return plates

def set_up_compounds(data):
    compounds = []
    for t in data:
        c = Compounds.objects.create(code=t[0], smiles=t[1])
        compounds.append(c)
    return compounds

def set_up_source_wells(data, plates_data, library_data, compounds_data):
    plates = LibraryPlate.objects.all()
    if plates.count() == 0:
        plates = set_up_library_plates(plates_data, library_data)
    compounds = set_up_compounds(compounds_data)
    sws = []
    for t in data:
        sw = SourceWell.objects.create(compound=compounds[t[0]], library_plate=plates[t[1]], well=t[2], concentration=t[3], active=t[4])
        sws.append(sw)
    return sws

def set_up_subsets(data, library_data, compounds_data):
    libraries = Library.objects.all()
    compounds = Compounds.objects.all()
    if libraries.count() == 0:
        libraries = set_up_libraries(library_data)
    if compounds.count() == 0:
        compounds = set_up_compounds(compounds_data)
    subs = []
    for t in data:
        l =  LibrarySubset.objects.create(name=t[0], library=libraries[t[1]])
        for index in t[2]:
            l.compounds.add(compounds[index])
            l.save()
        subs.append(l)
    return subs

def set_up_proposals(data, library_data, subset_data, compounds_data):
    subsets = LibrarySubset.objects.all()
    libraries = Library.objects.all()
    if subsets.count() == 0:
        subsets = set_up_subsets(subset_data, library_data, compounds_data)
    if libraries.count() ==0:
        libraries = Library.objects.all()
    proposals = []
    for t in data:
        p =  Proposals.objects.create(proposal=t[0])
        for index in t[1]:
            p.libraries.add(libraries[index])
            p.save()
        for index in t[2]:
            p.subsets.add(subsets[index])
            p.save()        
        proposals.append(p)
    return proposals

def set_up_crystal_plates(data):
    plates = []
    for t in data:
        p = CrystalPlate.objects.create(name=t[0], drop_volume=t[1], plate_type=t[2], visit=t[3])
        plates.append(p)
    
    return plates

def set_up_spa_compounds(data):
    compounds = []
    for t in data:
        c = SpaCompound.objects.create(visit=t[0], library_name=t[1], library_plate=t[2], well=t[3], code=t[4], smiles=t[5])
        compounds.append(c)
    
    return compounds

def set_up_crystals(data, crystal_plate_data):
    plates = CrystalPlate.objects.all()
    if plates.count() == 0:
        plates = set_up_crystal_plates(crystal_plate_data)
    
    crystals = []
    for t in data:
        c = Crystal.objects.create(
            crystal_plate=plates[0], 
            visit=t[0], 
            well=[1], 
            echo_x=t[2], 
            echo_y=t[3], 
            score=t[4],
            crystal_name=t[5]
            
            )
        crystals.append(c)
    
    return crystals

def set_up_batches(data, crystal_plate_data):
    plates = CrystalPlate.objects.all()
    if plates.count() == 0:
        plates = set_up_crystal_plates(crystal_plate_data)
    
    batches = []
    for t in data:
        b = Batch.objects.create(
            number = t[0],
            visit = t[1],
            crystal_plate = plates[t[2]]
        )
        batches.append(b)
    
    return batches

def set_up_labs(data, batch_data, crystal_plate_data, crystal_data, spa_compound_data):
    batches = Batch.objects.all()
    if batches.count() == 0:
        batches = set_up_batches(batch_data, crystal_plate_data)
    
    crystals = Crystal.objects.all()
    if crystals.count() == 0:
        crystals = set_up_crystals(crystal_data, crystal_plate_data)
    
    compounds = SpaCompound.objects.all()
    if compounds.count() == 0:
        compounds = set_up_spa_compounds(spa_compound_data)


    labs = []
    for t in data:
        l = Lab.objects.create(
            crystal_name = crystals[t[0]],
            single_compound = compounds[t[1]],
            batch = batches[t[2]],
            visit = t[3]
        )
        labs.append(l)
    
    return labs

