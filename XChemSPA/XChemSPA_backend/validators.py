from API.models import Proposals, LibraryPlate, LibrarySubset
from django.core.exceptions import ObjectDoesNotExist
import re
from .helpers import get_proposal_from_visit

def update_error_log(error_log, err_string):
    try:
        error_log.append(err_string)
        return True
    except (AttributeError) as e:
        return False

def valid_import_mode(value, error_log):
    if value in ["add", "redo", "double"]:
        return True
    else:
        update_error_log(error_log, '<p>Form error (wrong value submitted for import mode)</p>')
        return False

def valid_import_library_key(key, error_log):
    key = str(key)
    if re.fullmatch('[0-9]+', key):
        return True
    elif re.fullmatch('([0-9]+)(\-[0-9]+)', key):
        return True
    else:
        update_error_log(error_log, '<p>Form error (invalid subset or subset part id)</p>')
        return False

def extract_subset_id(key):
    key = str(key)
    if re.fullmatch('[0-9]+', key):
        return key
    elif re.fullmatch('([0-9]+)(\-[0-9]+)', key):
        old_key = re.fullmatch('([0-9]+)(\-[0-9]+)', key)
        return old_key.group(1)
    else:
        return key

def subset_in_proposal(key, proposal, error_log):
    try:
        if not int(key) in [s.id for s in proposal.subsets.all()]:
            update_error_log(error_log, '<p>Form error (submitted subset does not belong in the current proposal)</p>')
            return False
        else:
            return True
    except ValueError:
        update_error_log(error_log, '<p>Form error (incorrect data type for subset id)</p>')
        return False
    except AttributeError:
        return False

def get_object(model, pk, error_log):
    print('get_object', model, pk, error_log )
    output = {}
    try:
        if model == Proposals:
            object = model.objects.get(proposal=pk)
        else:
            object = model.objects.get(pk=pk)
        output["object"] = object
        output["valid"] = True
    except (ObjectDoesNotExist, ValueError):
        update_error_log(error_log, '<p>Data submission error (object with identifier does not exist)</p>')
        output["object"] = None
        output["valid"] = False
    except AttributeError:
        update_error_log(error_log, '<p>Data submission error (non-existent model)</p>')
        output["object"] = None
        output["valid"] = False

    return output

def matching_library(plate, subset, error_log):
    if plate.library.id == subset.library.id:
        return True
    else:
        update_error_log(error_log, '<p>Data submission error (plate selected from subset belongs to different library)</p>')
        return False

def import_compounds_form_is_valid(post_data):
    error_log = []
    valid = True
    proposal = None
    for key in post_data:
        value = post_data.get(str(key), False)
        if key=='csrfmiddlewaretoken':
            pass
        elif key=='visit':
            p = get_proposal_from_visit(value)
            get_proposal = get_object(Proposals, p, error_log)
            proposal = get_proposal["object"]
            if not get_proposal["valid"]:
                valid = False

        elif key=='mode':
            if not valid_import_mode(value, error_log):
                valid = False
 
        else:
            if not valid_import_library_key(key, error_log):
                valid = False

            key = extract_subset_id(key)

            if not subset_in_proposal(key, proposal, error_log):
                valid = False

            get_plate = get_object(LibraryPlate, value, error_log)
            plate = get_plate["object"]
            get_subset = get_object(LibrarySubset, key, error_log)
            subset = get_plate["object"]

            if not (get_plate["valid"] and get_subset["valid"]):
                valid = False

            if not matching_library(plate, subset, error_log):
                valid = False

    print("error_log: ", error_log)

    return {"valid" :  valid, "error_log" : error_log}
