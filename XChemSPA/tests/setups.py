from API.models import Library, LibraryPlate, LibrarySubset, Compounds, SourceWell, Preset, Proposals

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

def set_up():
	
	
	pr = Preset.objects.create(name="preset1", description="desc")
		
	prop = Proposals.objects.create(proposal="proposal1")
	prop.libraries.add(l1)
	prop.libraries.add(l2)
	prop.save()