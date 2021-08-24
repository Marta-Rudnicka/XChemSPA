from API.models import (
    CompoundCombination,
    Project,
    LibraryPlate, 
    LibrarySubset, 
    SpaCompound, 
    Lab, 
    Batch,
    Crystal,
    CrystalPlate,
    )
from tools.string_parsers import get_proposal_from_visit, get_project_from_visit
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
import re
import json

def render_error_page(request, error_log):
    '''error_log - list of HTML strings to display'''
    return render(request, "XChemSPA_backend/error_log.html", {'error_log': error_log})

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
        project=get_project_from_visit(visit), 
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
                SpaCompound.objects.get(project=get_project_from_visit(visit), smiles=sw.compound.smiles, code=sw.compound.code)
            except ObjectDoesNotExist:
                create_spa_compound(sw, visit)
           
def get_unused_spa_compounds(visit):
    return SpaCompound.objects.filter(project=get_project_from_visit(visit), lab_data=None)

def import_new_spa_compounds(visit, subset_dictionary, allow_duplicates):
    #p = get_proposal_from_visit(visit)
    #proposal = Project.objects.get(proposal=p)
    project = get_project_from_visit(visit)
    for library in project.libraries.all():
        source_wells = get_compounds_from_library(library)
        add_new_spa_compounds(source_wells, visit, allow_duplicates)

    for subset in project.subsets.all():
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

''' MAKING BATCHES AND LINKING CRYSTALS TO COMPOUNDS '''

def create_batch(dict, visit):

    number = int(dict["batchNumber"])
    crystal_plate_id = int(dict["crystalPlate"])
    cp = CrystalPlate.objects.get(pk=crystal_plate_id)
    print('New batch. number: ', number, ", crystal_plate: ", cp)
    newBatch = Batch.objects.create(number = number, crystal_plate = cp, project=get_project_from_visit(visit))
    return newBatch

def create_lab_objects(batch_object, batch_dictionary, visit):
    i = 0
    for c in batch_dictionary["crystals"]:
        crystal = Crystal.objects.get(pk=c)
        compound_id = batch_dictionary["compounds"][i]
        if not batch_dictionary["cocktail"]:
            compound = SpaCompound.objects.get(pk=compound_id)
            print('Lab. crystal_name: ', crystal.id, ', single_compound: ', compound.code, 'visit: ', visit, 'batch: none yet')
        
            Lab.objects.create(
                crystal_name = crystal, 
                single_compound = compound, 
                batch = batch_object,
                project = get_project_from_visit(visit)
                )
        else:
            compound = CompoundCombination.objects.get(pk=compound_id)
            Lab.objects.create(
                crystal_name = crystal, 
                compound_combination = compound, 
                batch = batch_object,
                project = get_project_from_visit(visit)
                )

        i += 1