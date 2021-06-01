from API.models import Proposals, LibraryPlate, LibrarySubset, SpaCompound
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
import re

def render_error_page(request, error_log):
    '''error_log - list of HTML strings to display'''
    return render(request, "XChemSPA_backend/error_log.html", {'error_log': error_log})

def get_proposal_from_visit(visit):
    visit_pattern = '([A-Za-z0-9_]+)(\-[0-9]+)'
    p = re.fullmatch(visit_pattern, visit)
    try:
        return p.group(1)
    except AttributeError:
        return ""

'''IMPORTING DATA INTO SPACOMPOUNDS'''

def get_compounds_from_library(library):
    current_plates = LibraryPlate.objects.filter(library=library, current=True)
    source_wells = []
    for p in current_plates:
        source_wells = source_wells + [c for c in p.compounds.filter(active=True)]
    return source_wells
    
def get_compounds_from_subset(subset, plate):
    
    source_wells = []
    for compound in subset.compounds.all():
        try:
            c = plate.compounds.get(compound = compound)
            if c.active:
                source_wells.append(c)
        except ObjectDoesNotExist:
            pass
    
    return source_wells

def create_spa_compound(sw, visit):
    
     SpaCompound.objects.create(
                visit=visit, 
                library_name=sw.library_plate.library.name, 
                library_plate=sw.library_plate.barcode, 
                well=sw.well, 
                code=sw.compound.code, 
                smiles=sw.compound.smiles
                )

def add_new_spa_compounds(source_wells, visit, allow_duplicates):
    if allow_duplicates:
        for sw in source_wells:
            create_spa_compound(sw, visit)
    else:
        for sw in source_wells:
            try:
                SpaCompound.objects.get(visit=visit, smiles=sw.compound.smiles, code=sw.compound.code)
            except ObjectDoesNotExist:
                create_spa_compound(sw, visit)
           
def get_unused_spa_compounds(visit):
    return SpaCompound.objects.filter(visit=visit, crystal=None)

def import_new_spa_compounds(visit, subset_dictionary, allow_duplicates):
    p = get_proposal_from_visit(visit)
    proposal = Proposals.objects.get(proposal=p)
    for library in proposal.libraries.all():
        source_wells = get_compounds_from_library(library)
        add_new_spa_compounds(source_wells, visit, allow_duplicates)

    for subset in proposal.subsets.all():
        source_wells = []
        for plate_id in subset_dictionary[subset.id]:
            plate = LibraryPlate.objects.get(pk=plate_id)
            source_wells = source_wells + get_compounds_from_subset(subset, plate)
        
        add_new_spa_compounds(source_wells, visit, allow_duplicates)

def overwrite_old_import(visit, subset_dictionary):
    for compound in get_unused_spa_compounds(visit):
        compound.delete()

    import_new_spa_compounds(visit, subset_dictionary, False)


def get_subset_dictionary(post_data):
    dict = {}
    for key in post_data:
        if key in ['csrfmiddlewaretoken', 'visit', 'mode']:
            pass
        else:
            value = int(post_data.get(key, False))
            subset_id = re.match('^[0-9]+', key).group(0)
            try:
                plate_ids = dict[int(subset_id)]
            except KeyError:
                plate_ids = []

            plate_ids.append(value)
            
            dict[int(subset_id)] = plate_ids
    
    return dict
