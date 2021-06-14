from API.models import Proposals, LibraryPlate, LibrarySubset
from django.core.exceptions import ObjectDoesNotExist
import re
import csv
from .string_parsers import get_proposal_from_visit

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

#GENERAL USE 
def is_csv(file_name, error_log):
	match = re.fullmatch('(.*)+\.csv$', file_name)

	if match:
		return True
	msg = "FILE ERROR: Wrong file type: '" + file_name + "'! Compound data should be uploaded as a CSV file."
	update_error_log(msg, error_log)
	return False

#UPLOADING CSV FILE FROM TEXRANK (CRYSTAL DATA)

def import_crystals_form_is_valid(post_data):
    error_log = []
    valid = True
    for key in post_data:
        value = post_data.get(str(key), False)
        if key=='csrfmiddlewaretoken':
            pass
        elif key=='visit':
            p = get_proposal_from_visit(value)
            try:
                Proposals.objects.get(proposal=p)
            except ObjectDoesNotExist:
                update_error_log[error_log, "Unrecognised proposal in the visit"]
                valid = False
        elif key=='data_file':
            if not valid_texrank_file(value, error_log):
                valid = False
        elif key=='drop_volume':
            try:
                float(value)
            except ValueError:
                update_error_log[error_log, "Invalid drop volume (not a number)"]
                valid = False
        elif key=='plate_type':
            if not value in ['SwissCI-3drop', 'SwissCI-2drop', 'MRC-2drop', 'MiTInSitu']:
                update_error_log[error_log, "Invalid plate type value"]
                valid = False
    
    return {"valid" :  valid, "error_log" : error_log}

def valid_texrank_file(file_name, error_log):
    if not is_csv(file_name, error_log):
        return False
    
    try:
        well_names = []
        with open(file_name, newline='') as csvfile:
            dialect = csv.Sniffer().sniff(csvfile.read(1024))
            dialect.delimiter = ','
            csvfile.seek(0)
            crystal_reader = csv.reader(csvfile, dialect)
            for row in crystal_reader:
                if not valid_crystal_data(row, well_names):
                    update_error_log(error_log, "Unexpected data found inside the file. Please make sure you are uploading the correct file.")
                    return False
		
    except FileNotFoundError:
        msg = "FILE ERROR: File '" + file_name + "' does not exist!"
        update_error_log(msg, error_log)
        return False
	
    return True

def valid_crystal_data(row, well_names):
    try:
        assert(valid_well_name(row[0]))
        assert(unique_well_name(row[0], well_names))
        assert(valid_coordinates(row[1], row[2]))
        assert(valid_score(row[3]))
        
        if "" in [row[1], row[2], row[3]]:
            assert(row[1]=="")
            assert(row[2]=="")
            assert(row[3]=="")
        return True
    except AssertionError:
       return False

def valid_well_name(string):
    try:
        pattern = '[A-H][0-9][0-9][a,c,d]'	
        digit_part = '[0-9][0-9]'
        
        assert(re.fullmatch(pattern, string))
        assert(int(re.search(digit_part, string)[0]) < 13 )        
        return True
    except (TypeError, AssertionError ):
        return False

def unique_well_name(string, well_names):
    try:
        assert(string not in well_names)
        well_names.append(string)
        return True
    except (TypeError, AssertionError):
        return False

def valid_coordinates(str1, str2):
    #TODO: find out if min and max possible values; now only checks if it's an int

    if str1 == "" and str2 == "":
        return True

    try:
        int(str1)
    except (ValueError, TypeError):
        return False
    
    try:
        int(str2)
        return True
    except (ValueError, TypeError):
        return False

def valid_score(string):
    if string == "":
        return True
    
    try:
        pattern = '[0-9clhdges]'
        assert(re.fullmatch(pattern, str(string)))
        return True
    except (TypeError, AssertionError):
        return False