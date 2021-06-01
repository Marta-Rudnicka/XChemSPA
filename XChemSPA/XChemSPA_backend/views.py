from django.shortcuts import render
from .helpers import import_new_spa_compounds, overwrite_old_import, render_error_page, get_subset_dictionary
from .validators import import_compounds_form_is_valid
from django.http import HttpResponseRedirect
from API.models import Proposals

def import_compounds(request):
    if request.method == "POST":
        if import_compounds_form_is_valid(request.POST)["valid"]:
            subset_dictionary = get_subset_dictionary(request.POST)
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
 

            
    return HttpResponseRedirect('/source')
