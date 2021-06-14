from django.http.response import JsonResponse
from tools.uploads_downloads import import_crystal_data_from_textrank
from API.models import CrystalPlate
from django.shortcuts import render
from .helpers import get_proposal_from_visit, import_new_spa_compounds, overwrite_old_import, render_error_page, get_subset_dictionary
from tools.validators import import_compounds_form_is_valid, import_crystals_form_is_valid
from django.http import HttpResponseRedirect
from django.core.files.storage import FileSystemStorage
from API.models import Proposals
from django.core.exceptions import ObjectDoesNotExist

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