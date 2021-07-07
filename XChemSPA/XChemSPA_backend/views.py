from django.http.response import JsonResponse, HttpResponse
from tools.uploads_downloads import import_crystal_data_from_textrank, create_validated_combinations
from API.models import CrystalPlate, Batch, Crystal, SpaCompound, Lab
from django.shortcuts import render
from .helpers import (
    get_proposal_from_visit, 
    import_new_spa_compounds, 
    overwrite_old_import, 
    render_error_page, 
    get_subset_dictionary,
    create_batch,
    create_lab_objects
)
from tools.validators import (
    import_compounds_form_is_valid, 
    import_crystals_form_is_valid, 
    valid_batch_JSON_data,
    combinations_form_is_valid,
    valid_combinations_file,
)
from tools.conversions import create_well_dict
from django.http import HttpResponseRedirect
from django.core.files.storage import FileSystemStorage
from API.models import Proposals
from django.core.exceptions import ObjectDoesNotExist
from datetime import date
import json

def import_compounds(request):
    if request.method == "POST":
        if import_compounds_form_is_valid(request.POST)["valid"]:
            subset_dictionary = get_subset_dictionary(request.POST)
            print('subset_dictionary: ', subset_dictionary)
            mode = request.POST.get("mode", False)
            visit = request.POST.get("visit", False)
        
            if mode == "add":
                import_new_spa_compounds(visit, subset_dictionary, False)
            elif mode == "redo":
                overwrite_old_import(visit, subset_dictionary)
            else:
                import_new_spa_compounds(visit, subset_dictionary, True)
        
        else:
            #return render_error_page(request, import_form_is_valid(request.POST)["error_log"])    
            print(import_compounds_form_is_valid(request.POST)["error_log"])    
 

            
    return HttpResponseRedirect('/source/')

def import_new_crystals(request):
    if request.method == "POST":
        if import_crystals_form_is_valid(request.POST)["valid"]:
            print(request.POST)
            name = request.POST.get("barcode", False)
            drop_volume = float(request.POST.get("drop_volume", False))
            plate_type = request.POST.get("plate_type", False)
            crystal_plate = CrystalPlate.objects.create(name=name, drop_volume=drop_volume, plate_type=plate_type)
            visit = request.POST.get("visit", False)
            source = request.FILES["data_file"]
            fs = FileSystemStorage()
            file_name = fs.save(source.name, source)
            import_crystal_data_from_textrank(file_name, crystal_plate, visit)
            fs.delete(file_name)
    else:
        print(import_crystals_form_is_valid(request.POST)["error_log"])    
    return HttpResponseRedirect('/crystals/')

def verify_visit(request):
    if request.method == "POST":
        visit = request.POST.get("visit", False)
        p = get_proposal_from_visit(visit)
        try:
            Proposals.objects.get(proposal=p)
            json = {"verified_visit": visit}
            return JsonResponse(json, safe=False)

        except ObjectDoesNotExist:
            print('Bad visit')
            return HttpResponseRedirect('/visit/')

def create_combinations(request):
    if request.method == "POST":
        error_log = []
        if combinations_form_is_valid(request.POST, error_log):
            print(request.POST)
            print('valid form')
        
            fs = FileSystemStorage()
            source = request.FILES["data_file"]
            file_name = fs.save(source.name, source)
            visit = request.POST.get("visit", False)

            if valid_combinations_file(file_name, visit, error_log):
                print('valid file')
                create_validated_combinations(file_name, visit)
                fs.delete(file_name)
            else:
                print('invalid file')
                fs.delete(file_name)
                return render_error_page(request, error_log)
                #visit = request.POST.get("visit", False)
                
                #fs = FileSystemStorage()
                #file_name = fs.save(source.name, source)
                #create_combinations(file_name, visit)
           
            
            return render_ok_page(request)
        else:
            print('invalid form')
            return render_error_page(request, error_log)

def create_batches(request):
    
    if request.method == "POST":
        print('posted to create_batches')
        batches_str = request.POST.get("batches", False)
        visit = request.POST.get("visit", False) #TODO validate visit
        print(batches_str)
        error_log = []
        if valid_batch_JSON_data(batches_str, error_log):
            print('valid')
            batches_list = json.loads(batches_str)
            for b in batches_list:
                batch = create_batch(b, visit)
                create_lab_objects(batch, b, visit)
            
            return HttpResponse(status=201)
        else:
            print('invalid', error_log)
            return render_error_page(request, error_log)

def serve_soak_echo_file(request, pk, soak):
    dict = create_well_dict()
    batch = Batch.objects.get(pk=pk)
    if "3drop" in batch.crystal_plate.plate_type:
        platetype = "-3drop"
    else:
        platetype = "-2drop"

    plate_batch = "Batch-" + str(batch.number) + '_???_' + str(date.today()) + '_' + batch.crystal_plate.name + platetype

    header = "PlateBatch, Source well, Destination well, Transfer Volume, Destination Well X Offset, Destination Well Y Offset \n"
    print(header)
    file_path = 'soak.csv'

    with open(file_path, 'r+') as f:
        f.truncate(0)
        f.write(header)
        
        for c in batch.crystals.all():

            dest_well = dict[c.crystal_name.well]
            if soak == 0:
                source_well = c.single_compound.well
            else:
                source_well = c.compound_combination.compounds.all()[soak-1].well
            
            strings = [plate_batch, source_well , dest_well, str(batch.soak_vol), str(c.crystal_name.echo_x), str(c.crystal_name.echo_y), "\n"]

            line = ','.join(strings)
            f.write(line)
        
        f.close()
        with open(file_path, 'r+') as f:
            filename = plate_batch + "_soak"
            if soak > 0:
                filename = filename + "soak-" + str(soak)
            filename = filename + '.csv'
            response = HttpResponse(f, content_type='text/csv')
            response['Content-Disposition'] = "attachment; filename=%s" % filename
	
    return response


def serve_cryo_echo_file(request, pk, soak):
    dict = create_well_dict()
    batch = Batch.objects.get(pk=pk)
    if "3drop" in batch.crystal_plate.plate_type:
        platetype = "-3drop"
    else:
        platetype = "-2drop"

    plate_batch = "Batch-" + str(batch.number) + '_???_' + str(date.today()) + '_' + batch.crystal_plate.name + platetype

    header = "PlateBatch, Source well, Destination well, Transfer Volume, Destination Well X Offset, Destination Well Y Offset \n"
    print(header)
    file_path = 'cryo.csv'

    with open(file_path, 'r+') as f:
        f.truncate(0)
        f.write(header)
        
        for c in batch.crystals.all():

            dest_well = dict[c.crystal_name.well]
            source_well = batch.cryo_location           
            strings = [plate_batch, source_well , dest_well, str(batch.cryo_transfer_vol), str(c.crystal_name.echo_x), str(c.crystal_name.echo_y), "\n"]

            line = ','.join(strings)
            f.write(line)
        
        f.close()
        with open(file_path, 'r+') as f:
            filename = plate_batch + '_cryo' 
            if soak > 0:
                filename = filename + "soak-" + str(soak)
            filename = filename + '.csv'
            response = HttpResponse(f, content_type='text/csv')
            response['Content-Disposition'] = "attachment; filename=%s" % filename
	
    return response

def render_error_page(request, error_log):
    return render(request, "XChemSPA_backend/errors.html", {'error_log': error_log})

def render_ok_page(request):
    return render(request, "XChemSPA_backend/ok.html")