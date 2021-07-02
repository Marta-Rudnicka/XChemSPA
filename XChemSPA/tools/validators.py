from API.models import CompoundCombination, CrystalPlate, Proposals, LibraryPlate, LibrarySubset, SpaCompound, Crystal
from django.core.exceptions import ObjectDoesNotExist
import re
import csv
import json
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

#BATCH DATA
def valid_JSON(str, error_log):
    #check if it's a JSON string at all
    try:
        data = json.loads(str)
    except json.decoder.JSONDecodeError:
        update_error_log(error_log, "Application error: invalid JSON string submitted for batch data.")
        return False

    #check if it's a list
    if isinstance(data, list):
        pass
    else:
        update_error_log(error_log, "Application error: invalid batch data: exected a list, received {type}.".format(type=type(data)))
        return False

    #check if it has all the data
    try:
        for batch in data:
            batch['batchNumber']
            batch['crystalPlate']
            batch['compounds']
            batch['crystals']
        return True
    except KeyError as e:
        update_error_log(
            error_log, 
            "Application error: invalid batch data (failed to find key: {key}). Other keys might be missing too.".format(key=e.args[0]))
        return False

def valid_batch_number(str, error_log):
    try:
        n = int(str)
    except ValueError:
        update_error_log(error_log, "Application error: invalid batch number (not a number)")
        return False
    
    if n < 1:
        update_error_log(error_log, "Application error: negative batch number")
        return False
        #TODO: check if there is already a batch with the number for the visit
    return True

def valid_crystal_plate(str, error_log):
    try:
        pk = int(str)
        CrystalPlate.objects.get(pk=pk)
        return True
    except ValueError:
        update_error_log(error_log, "Application error: invalid crystal plate id submitted with batch data (not a number)")
        return False
    except ObjectDoesNotExist:
        update_error_log(error_log, "Application error: invalid crystal plate id submitted with batch data  (no such plate found)")
        return False

def valid_ids(id_list, object_type, error_log):
    try:
        if id_list=="":
            update_error_log(
                error_log, 
                "Application error: empty batch, no {object_type} ids submitted with batch data".format(object_type=object_type)
                )
            return False

        for id in id_list:
            id = int(id)

            if object_type == "compound":
                SpaCompound.objects.get(pk=id)
            elif object_type == "crystal":
                Crystal.objects.get(pk=id)
            elif object_type == "combination":
                CompoundCombination.objects.get(pk=id)
            else:
                update_error_log(
                error_log, 
                "Application error: invalid argument for <valid_ids()> : {object_type}. ".format(object_type=object_type)
                )
                return False
        return True

    except ValueError:
        update_error_log(
            error_log, 
            "Application error: invalid {object_type} ids submitted with batch data (non-numeric values found)".format(object_type=object_type)
            )
        return False
    
    except TypeError:
        update_error_log(
            error_log, 
            "Application error: invalid {object_type} ids submitted with batch data (not a list)".format(object_type=object_type)
            )
        return False

    except ObjectDoesNotExist:
        update_error_log(
            error_log, 
            "Application error: invalid {object_type} ids submitted with batch data (no such {object_type}s found)".format(object_type=object_type)
            )
        return False
    
def valid_batch_JSON_data(string, error_log):
    print('entering valid_batch_JSON_data')
    if valid_JSON(string, error_log):
        pass
    else:
        print('invalid JSON')
        return False
    print('passed json validation')
    batches = json.loads(string)
    print('batches: ', batches)
    
    try:
        for batch in batches:
            assert valid_batch_number(batch['batchNumber'], error_log)
            assert valid_crystal_plate(batch['crystalPlate'], error_log)
            assert valid_ids(batch['crystals'], 'crystal', error_log)
            if batch['cocktail']:
                assert valid_ids(batch['compounds'], 'combination', error_log)
            else:
                assert valid_ids(batch['compounds'], 'compound', error_log)

    
    except AssertionError:
        return False
    
    return True

#UPLOADING COMBINATION LIST

def combinations_form_is_valid(post_data, error_log):
    error_log = []
    valid = True
    for key in post_data:
        value = post_data.get(str(key), False)
        if key=='csrfmiddlewaretoken':
            pass
        elif key=='visit':
            visit = value
            p = get_proposal_from_visit(value)
            try:
                Proposals.objects.get(proposal=p)
                print('valid visit')
            except ObjectDoesNotExist:
                update_error_log[error_log, "Unrecognised proposal string in the visit"]
                valid = False
   # value = file_data['data_file']
   # if not valid_combinations_file(value, visit, error_log):
   #     valid = False
   #     print('invalid file')
   # else:
   #     print('valid file')
    return valid

def valid_combinations_file(file_name, visit, error_log):

    valid = True
	
    with open(file_name, newline='') as csvfile:
        dialect = csv.Sniffer().sniff(csvfile.read(1024))
        csvfile.seek(0)
        reader = csv.reader(csvfile, dialect)
		
        header = next(reader, None)
        
        if not valid_combinations_headers(header, error_log):
            return False

        indices = get_index_from_headers(header)

        #go back to the second line of the file (first line of data)
        csvfile.seek(0)
        next(reader)
		
        line_number = 1
        for row in reader:
            combination_number = row[indices["combination"]]

            if not valid_combination_number(combination_number, error_log, line_number):
                valid = False
            
            try:
                if not valid_compound_reference(row, indices, visit, error_log, line_number):
                    valid = False
            except IndexError:
                update_error_log(error_log, "Line {line_number}: {row}: not enough fields".format(line_number=line_number, row=row))
                valid = False
            
            line_number += 1
        
        return valid
            
def valid_compound_reference(line, indices_dictionary, visit, error_log, line_num):
    '''looks for either valid code and smiles or valid related crystal'''

    found_reference = False

    if indices_dictionary["code"] != None and indices_dictionary["smiles"] != None:
        code = line[indices_dictionary["code"]]
        smiles = line[indices_dictionary["smiles"]]
        if code and smiles:                         #ignore empty strings
            if valid_compound(code, smiles, visit, error_log, line_num ):
                found_reference = True
    
    if indices_dictionary["related_crystal"] != None:
        related_crystal = line[indices_dictionary["related_crystal"]]
        if related_crystal:                         #ignore empty string
            if valid_related_crystal(related_crystal, visit, error_log, line_num):
                found_reference = True
    
    if not found_reference:
        update_error_log(error_log, "Line {line_num}: Neither valid compound code and smiles nor a valid related crystal found".format(line_num = line_num))
        return False
    
    return True

def valid_combinations_headers(header, error_log):
    valid = True
    header = [s.strip().lower() for s in header]

    try:
        header.index('combination')
    except ValueError:
        update_error_log(error_log, "Column for combination number not found. Make sure your file uses the header 'Combination' for it.")
        valid = False
		
    try:
        c = header.index('code')
    except ValueError:
        c = None

    try:
        s = header.index('smiles')
    except ValueError:
        s = None
    
    try:
        rc = header.index('related crystal')
    except ValueError:
        rc = None

    if not ((c !=None and s !=None ) or rc != None):
        update_error_log(error_log, "Columns for compounds not found. Make sure your file uses headers " 
                                    "'Code' and 'SMILES' for identifying a compound, or 'Related crystal' "
                                    "to find the compound based on a previously used crystal.")
        valid = False

    return valid

def valid_combination_number(number, error_log, line_num):
    try:
        int(number)
        return True
    except (ValueError, TypeError):
        update_error_log(error_log, "Line {line_num}: Invalid combination number: {number}".format(line_num=line_num, number=number))
        return False

def valid_compound(code, smiles, visit, error_log, line_num):
    if SpaCompound.objects.filter(visit=visit, code=code, smiles=smiles).count() > 0:
        return True
    else:
        update_error_log(error_log, "Line {line_num}: compound not found: {code} : {smiles}".format(line_num=line_num, code=code, smiles=smiles))
        return False

def valid_related_crystal(crystal_name, visit, error_log, line_num):
    try:
        Crystal.objects.get(crystal_name=crystal_name, visit=visit)
        return True
    except ObjectDoesNotExist:
        update_error_log(error_log, "Line {line_num}: crystal not found: {crystal_name}".format(line_num=line_num, crystal_name=crystal_name))
        return False

def get_index_from_headers(header):
    header = [s.strip().lower() for s in header]

    dict = {}
    dict["combination"] = header.index('combination')
    try:
        dict["code"] = header.index('code')
        dict["smiles"] = header.index('smiles')
    except ValueError:
        dict["code"] = None
        dict["smiles"] = None

    try:
        dict["related_crystal"] = header.index('related crystal')
    except ValueError:
        dict["related_crystal"] = None

    return dict