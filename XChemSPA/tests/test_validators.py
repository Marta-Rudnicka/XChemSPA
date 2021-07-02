from logging import error
from API.models import Library, LibraryPlate, CrystalPlate, SpaCompound, Crystal, Lab
from setups import set_up_crystal_plates, set_up_library_plates
from API.models import Proposals, LibrarySubset
from tools.validators import (
        get_index_from_headers,
        matching_library,
        extract_subset_id,
        update_error_log,
        valid_JSON,
        valid_batch_JSON_data,
        valid_batch_number,
        valid_crystal_plate,
        valid_import_mode,
        valid_import_library_key,
        subset_in_proposal,
        get_object,
        valid_well_name,
        unique_well_name,
        valid_coordinates,
        valid_score,
        valid_crystal_data,
        valid_ids,
        valid_combination_number,
        valid_compound,
        valid_related_crystal,
        valid_combinations_headers,
        valid_compound_reference,
)

from django.test import TestCase
from setups import (
    libraries_data,
    compounds_data,
    subsets_data,
    proposals_data,
    plates_data,
    crystal_plate_data,
    spa_compound_data,
    crystal_data,
    batch_data,
    lab_data,
    set_up_libraries,
    set_up_subsets,
    set_up_proposals,
    #set_up_crystal_plates,
    set_up_spa_compounds,
    set_up_crystals,
    set_up_labs,
)

class UpdateErrorLogTest(TestCase):
    def test1(self):
        string = "str"
        log = []
        self.assertTrue(update_error_log(log, string))
        self.assertEqual(log, ["str"])

    def test2(self):
        string = "str2"
        log = ["str"]
        self.assertTrue(update_error_log(log, string))
        self.assertEqual(log, ["str", "str2"])

    def test3(self):
        string = "str"
        log = "x"
        self.assertFalse(update_error_log(log, string))
        self.assertEqual(log, "x")
    
    def test4(self):
        self.assertFalse(update_error_log(None, None))

    def test5(self):
        self.assertFalse(update_error_log(1, 2))

class ValidImportModeTests(TestCase):

    def test1(self):
        self.assertTrue(valid_import_mode("add", []))

    def test2(self):
            self.assertTrue(valid_import_mode("redo", []))

    def test3(self):
            self.assertTrue(valid_import_mode("double", []))

    def test4(self):
            self.assertFalse(valid_import_mode("", []))

    def test5(self):
            self.assertFalse(valid_import_mode(8, []))

    def test6(self):
            self.assertFalse(valid_import_mode("x", []))

    def test7(self):
            self.assertFalse(valid_import_mode(None, 3))

class ValidImportLibraryKeyTest(TestCase):
    def test1(self):
        self.assertTrue(valid_import_library_key("3-5", []))

    def test2(self):
        self.assertTrue(valid_import_library_key("3", []))   

    def test3(self):
        self.assertTrue(valid_import_library_key(7, [])) 
    
    def test4(self):
        self.assertFalse(valid_import_library_key("dupa", []))

    def test5(self):
        self.assertFalse(valid_import_library_key([], []))
    
    def test6(self):
        self.assertFalse(valid_import_library_key("3-4-5", []))

    def test7(self):
        self.assertTrue(valid_import_library_key("12-8", 45))

    def test8(self):
        self.assertFalse(valid_import_library_key("str", 45))

class ExtractSubsetIdTest(TestCase):
    def test1(self):
        self.assertEqual(extract_subset_id("4-7"), "4")

    def test2(self):
        self.assertEqual(extract_subset_id("41-3"), "41")

    def test3(self):
        self.assertEqual(extract_subset_id("4"), "4")

    def test1(self):
        self.assertEqual(extract_subset_id("12"), "12")

    def test1(self):
        self.assertEqual(extract_subset_id(8), "8")

    def test1(self):
        self.assertEqual(extract_subset_id(None), "None")

class SubsetInProposal(TestCase):
    def setUp(self):
        set_up_proposals(proposals_data, libraries_data, subsets_data, compounds_data)

    def test1(self):
        prop1 = Proposals.objects.get(proposal="proposal1")
        prop2 = Proposals.objects.get(proposal="proposal2")
        sub1 = LibrarySubset.objects.get(name="lib1-s1")
        key1 = sub1.id
        error_log = []
        err_string = "<p>Form error (submitted subset does not belong in the current proposal)</p>"
        name_err_string = '<p>Data submission error (non-existent model)</p>'
        value_err_string = '<p>Form error (incorrect data type for subset id)</p>'
        self.assertTrue(subset_in_proposal(key1, prop1, error_log))
        self.assertTrue(error_log == [])
        self.assertFalse(subset_in_proposal(key1, prop2, error_log))
        self.assertTrue(error_log == [err_string])
        self.assertFalse(subset_in_proposal("some-string", prop2, error_log))
        self.assertTrue(error_log == [err_string, value_err_string])
        self.assertFalse(subset_in_proposal(key1, "x", error_log))
        self.assertTrue(error_log == [err_string, value_err_string])

class GetObjectTest(TestCase):
    def setUp(self):
        set_up_proposals(proposals_data, libraries_data, subsets_data, compounds_data)
        set_up_library_plates(plates_data, libraries_data)
    
    def test_proposals(self):
        prop1 = Proposals.objects.get(proposal="proposal1")
        prop2 = Proposals.objects.get(proposal="proposal2")
        log = []
        err_str = '<p>Data submission error (object with identifier does not exist)</p>'
        name_err_str = '<p>Data submission error (non-existent model)</p>'
        self.assertEqual(get_object(Proposals, "proposal1", log), {"object": prop1, "valid" : True})
        self.assertEqual(get_object(Proposals, "proposal2", log), {"object": prop2, "valid" : True})
        self.assertEqual(get_object(Proposals, "proposal2", 3), {"object": prop2, "valid" : True})
        self.assertEqual(log, [])

        self.assertEqual(get_object(Proposals, "str", log), {"object": None, "valid" : False})
        self.assertEqual(log, [err_str])

        self.assertEqual(get_object(Proposals, "str", 18), {"object": None, "valid" : False})
        self.assertEqual(log, [err_str])

        self.assertEqual(get_object("Model", "proposal1", log), {"object": None, "valid" : False})
        self.assertEqual(log, [err_str, name_err_str])

    def test_library_plate(self):
        plate1 = LibraryPlate.objects.get(barcode="xyz-current")
        plate2 = LibraryPlate.objects.get(barcode="xyz-old1")
        pk1 = plate1.id
        pk2 = plate2.id
        log = []
        err_str = '<p>Data submission error (object with identifier does not exist)</p>'
        
        self.assertEqual(get_object(LibraryPlate, pk1, log), {"object": plate1, "valid" : True})
        self.assertEqual(get_object(LibraryPlate, pk2, log), {"object": plate2, "valid" : True})
        self.assertEqual(get_object(LibraryPlate, pk2, 3), {"object": plate2, "valid" : True})
        self.assertEqual(log, [])

        self.assertEqual(get_object(LibraryPlate, "str", log), {"object": None, "valid" : False})
        self.assertEqual(log, [err_str])

        self.assertEqual(get_object(LibraryPlate, "str", 18), {"object": None, "valid" : False})
        self.assertEqual(log, [err_str])

        self.assertEqual(get_object(LibraryPlate, 118, log), {"object": None, "valid" : False})
        self.assertEqual(log, [err_str, err_str])

    def test_library_subset(self):
        sub1 = LibrarySubset.objects.get(name="lib1-s1")
        sub2 = LibrarySubset.objects.get(name="lib3-s1")
        pk1 = sub1.id
        pk2 = sub2.id
        log = []
        err_str = '<p>Data submission error (object with identifier does not exist)</p>'
        
        self.assertEqual(get_object(LibrarySubset, pk1, log), {"object": sub1, "valid" : True})
        self.assertEqual(get_object(LibrarySubset, pk2, log), {"object": sub2, "valid" : True})
        self.assertEqual(get_object(LibrarySubset, pk2, 3), {"object": sub2, "valid" : True})
        self.assertEqual(log, [])

        self.assertEqual(get_object(LibrarySubset, "str", log), {"object": None, "valid" : False})
        self.assertEqual(log, [err_str])

        self.assertEqual(get_object(LibrarySubset, "str", 18), {"object": None, "valid" : False})
        self.assertEqual(log, [err_str])

        self.assertEqual(get_object(LibrarySubset, 118, log), {"object": None, "valid" : False})
        self.assertEqual(log, [err_str, err_str])

class MatchingLibraryTest(TestCase):
    def setUp(self):
        set_up_subsets(subsets_data, libraries_data, compounds_data)
        set_up_library_plates(plates_data, libraries_data)
    
    def test1(self):
        lib1 = LibraryPlate.objects.get(barcode="xyz-current")
        lib3 = LibraryPlate.objects.get(barcode="abc")

        sub1_1 = LibrarySubset.objects.get(name="lib1-s1")
        sub1_2 = LibrarySubset.objects.get(name="lib1-s2")
        sub3_1 = LibrarySubset.objects.get(name="lib3-s1")
        sub3_2 = LibrarySubset.objects.get(name="lib3-s2")

        err_log = []
        err_str = '<p>Data submission error (plate selected from subset belongs to different library)</p>'

        self.assertTrue(matching_library(lib1, sub1_1, err_log))
        self.assertTrue(matching_library(lib3, sub3_2, err_log))
        self.assertEqual(err_log, [])
        self.assertFalse(matching_library(lib3, sub1_2, err_log))
        self.assertEqual(err_log, [err_str])

class ValidCrystalDataTest(TestCase):
    '''test valid_crystal_data() and its helpers'''

    def test_valid_crystal_name(self):
        self.assertTrue(valid_well_name('A01a'))
        self.assertTrue(valid_well_name('H12d'))
        self.assertFalse(valid_well_name('H12b'))
        self.assertFalse(valid_well_name('B2d'))
        self.assertFalse(valid_well_name('H15a'))
        self.assertFalse(valid_well_name('K07a'))
        self.assertFalse(valid_well_name(''))
        self.assertFalse(valid_well_name([12,7]))

    def test_unique_crystal_name(self):
        well_names = []
        self.assertTrue(unique_well_name("A01a", well_names))
        self.assertTrue(unique_well_name("F10c", well_names))
        self.assertTrue(unique_well_name("A04d", well_names))
        self.assertFalse(unique_well_name("A01a", well_names))
        self.assertFalse(unique_well_name("F10c", well_names))
        self.assertFalse(unique_well_name("A04d", well_names))
        self.assertFalse(unique_well_name("A04d", 14))
        self.assertTrue(unique_well_name([14,2], well_names))

    def test_valid_coordinates(self):
        self.assertTrue(valid_coordinates(1, 4))
        self.assertTrue(valid_coordinates(1, -824))
        self.assertTrue(valid_coordinates("1", "4"))
        self.assertTrue(valid_coordinates("1", "-824"))
        self.assertTrue(valid_coordinates("", ""))
        self.assertFalse(valid_coordinates([], -824))
        self.assertFalse(valid_coordinates("x", -824))
        self.assertFalse(valid_coordinates("", 24))
        self.assertFalse(valid_coordinates("654654654", ""))
        self.assertFalse(valid_coordinates("dupa", "dupa"))

    def test_valid_score(self):
        self.assertTrue(valid_score(0))
        self.assertTrue(valid_score("0"))
        self.assertTrue(valid_score("9"))
        self.assertTrue(valid_score(9))
        self.assertTrue(valid_score("c"))
        self.assertTrue(valid_score("h"))
        self.assertTrue(valid_score(""))
        self.assertFalse(valid_score("11"))
        self.assertFalse(valid_score(14))
        self.assertFalse(valid_score("lh"))
        self.assertFalse(valid_score([1, 2, 3]))
    
    def test_valid_crystal_data(self):
        well_names = []
        self.assertTrue(valid_crystal_data(['F12a', 150, -879, 6], well_names))
        self.assertTrue(valid_crystal_data(['F10a', "150", "-879", "6"], well_names))
        self.assertTrue(valid_crystal_data(['B12a', "" , "", ""], well_names))
        
        self.assertFalse(valid_crystal_data(['F11a', "" , "", "6"], well_names))
        self.assertFalse(valid_crystal_data(['B12a', "" , "", ""], well_names)) #well name not unique any more
        self.assertFalse(valid_crystal_data(['D11a', "x" , "7", "6"], well_names))
        self.assertFalse(valid_crystal_data(['F11a', "98" , "jk", "6"], well_names))
        self.assertFalse(valid_crystal_data(['F11a', "78" , "-567", "lkhkjhkj"], well_names))

class ValidBatchCreationDataTest(TestCase):

    def setUp(self):
        set_up_spa_compounds(spa_compound_data)
        set_up_crystals(crystal_data, crystal_plate_data)

    def test_valid_JSON(self):
        error_log = []
        good_json = '''[
            {"crystalPlate" : 1, "batchNumber" : 3, "compounds" : [1, 2, 3], "crystals" : [11, 12, 14]},
            {"crystalPlate" : 2, "batchNumber" : 8, "compounds" : [5, 7, 8], "crystals" : [18, 79, 78]}
            ]
            '''
        misssing_cp = '''[
            {"crystalPlate" : 1, "batchNumber" : 3, "compounds" : [1, 2, 3], "crystals" : [11, 12, 14]},
            {"batchNumber" : 8, "compounds" : [5, 7, 8], "crystals" : [18, 79, 78]}
            ]
            '''
        
        missing_bn = '''[
            {"crystalPlate" : 1, "compounds" : [1, 2, 3], "crystals" : [11, 12, 14]},
            {"crystalPlate" : 2, "batchNumber" : 8, "compounds" : [5, 7, 8], "crystals" : [18, 79, 78]}
            ]
            '''
        
        missing_compounds = '''[
            {"crystalPlate" : 1, "batchNumber" : 3, "crystals" : [11, 12, 14]},
            {"crystalPlate" : 2, "batchNumber" : 8, "compounds" : [5, 7, 8], "crystals" : [18, 79, 78]}
            ]
            '''

        missing_crystals = '''[
            {"crystalPlate" : 1, "batchNumber" : 3, "compounds" : [1, 2, 3], "crystals" : [11, 12, 14]},
            {"crystalPlate" : 2, "batchNumber" : 8, "compounds" : [5, 7, 8]}
            ]
            '''

        missing_multiple = '''[
            {"crystalPlate" : 1, "batchNumber" : 3, "compounds" : [1, 2, 3], "crystals" : [11, 12, 14]},
            {"crystalPlate" : 2, "compounds" : [5, 7, 8]}
            ]
            '''
        
        not_a_list = '{"crystalPlate" : 1, "batchNumber" : 3, "compounds" : [1, 2, 3], "crystals" : [11, 12, 14]}'
        not_a_json = "string"



        self.assertTrue(valid_JSON(good_json, error_log))
        self.assertEqual(error_log, [])

        self.assertFalse(valid_JSON(misssing_cp, error_log))
        self.assertFalse(valid_JSON(missing_bn, error_log))
        self.assertFalse(valid_JSON(missing_compounds, error_log))
        self.assertFalse(valid_JSON(missing_crystals, error_log))


        self.assertFalse(valid_JSON(missing_multiple, error_log))
        self.assertFalse(valid_JSON(not_a_list, error_log))
        self.assertFalse(valid_JSON(not_a_json, error_log))        
        
        errs = [
            "Application error: invalid batch data (failed to find key: crystalPlate). Other keys might be missing too.",
            "Application error: invalid batch data (failed to find key: batchNumber). Other keys might be missing too.",
            "Application error: invalid batch data (failed to find key: compounds). Other keys might be missing too.",
            "Application error: invalid batch data (failed to find key: crystals). Other keys might be missing too.",
            "Application error: invalid batch data (failed to find key: batchNumber). Other keys might be missing too.",
            "Application error: invalid batch data: exected a list, received <class 'dict'>.",
            "Application error: invalid JSON string submitted for batch data."

        ]
        self.assertEqual(error_log, errs)
    
    def test_valid_batch_number(self):
        error_log = []
        self.assertTrue(valid_batch_number(1, error_log))
        self.assertTrue(valid_batch_number("1", error_log))
        self.assertTrue(valid_batch_number(14, error_log))
        self.assertFalse(valid_batch_number(-14, error_log))
        self.assertFalse(valid_batch_number("-10", error_log))
        self.assertFalse(valid_batch_number("", error_log))
        self.assertFalse(valid_batch_number("somestring", error_log))
        errs = [
            "Application error: negative batch number",
            "Application error: negative batch number",
            "Application error: invalid batch number (not a number)",
            "Application error: invalid batch number (not a number)",
        ]
        self.assertEqual(error_log, errs)
    
    def test_valid_crystal_plate(self):
        crystals = CrystalPlate.objects.all()
        print('crystals: ', crystals)
        cpid1 = crystals[0].id
        cpid2 = crystals[1].id
        error_log = []
        self.assertTrue(valid_crystal_plate(cpid1, error_log))
        self.assertTrue(valid_crystal_plate(str(cpid1), error_log))
        self.assertTrue(valid_crystal_plate(cpid2, error_log))
        self.assertFalse(valid_crystal_plate(18, error_log))
        self.assertFalse(valid_crystal_plate("string", error_log))
        self.assertFalse(valid_crystal_plate("", error_log))

        errs = [
            "Application error: invalid crystal plate id submitted with batch data  (no such plate found)",
            "Application error: invalid crystal plate id submitted with batch data (not a number)",
            "Application error: invalid crystal plate id submitted with batch data (not a number)"
        ]

        self.assertEqual(error_log, errs)
    
    def test_valid_ids(self):
        spa_compounds = SpaCompound.objects.all()
        compounds_ids = [c.id for c in spa_compounds]
        crystals = Crystal.objects.all()
        crystal_ids = [c.id for c in crystals]

        error_log = []
        
        self.assertTrue(valid_ids(compounds_ids, "compound", error_log))
        self.assertTrue(valid_ids(["1", "3"], "compound", error_log))
        self.assertFalse(valid_ids("string", "compound", error_log))
        self.assertFalse(valid_ids("", "compound", error_log))
        self.assertFalse(valid_ids(["str1", "str2"], "compound", error_log))
        self.assertFalse(valid_ids(45, "compound", error_log))
        self.assertTrue(valid_ids(crystal_ids, "crystal", error_log))
        self.assertFalse(valid_ids(["2", "3"], "crystals", error_log))
        self.assertFalse(valid_ids(["2", "3", "8"], "crystal", error_log))
        


        errs = [
            "Application error: invalid compound ids submitted with batch data (non-numeric values found)",
            "Application error: empty batch, no compound ids submitted with batch data",
            "Application error: invalid compound ids submitted with batch data (non-numeric values found)",
            "Application error: invalid compound ids submitted with batch data (not a list)",
            "Application error: invalid argument for <valid_ids()> : crystals. ",
            "Application error: invalid crystal ids submitted with batch data (no such crystals found)"
        ]

        self.assertEqual(error_log, errs)

    def valid_batch_JSON_data(self):

        error_log = []

        good_json = '''[
            {"crystalPlate" : 0, "batchNumber" : 3, "compounds" : [0, 1, 2], "crystals" : [0, 1, 2]},
            {"crystalPlate" : 1, "batchNumber" : 8, "compounds" : [3, 4], "crystals" : [3, 4]}
            ]
            '''
        misssing_cp = '''[
            {"crystalPlate" : 1, "batchNumber" : 3, "compounds" : [1, 2, 3], "crystals" : [11, 12, 14]},
            {"batchNumber" : 8, "compounds" : [5, 7, 8], "crystals" : [18, 79, 78]}
            ]
            '''
        bad_batch_number = '''[
            {"crystalPlate" : 0, "batchNumber" : "str", "compounds" : [0, 1, 2], "crystals" : [0, 1, 2]},
            {"crystalPlate" : 1, "batchNumber" : 8, "compounds" : [3, 4], "crystals" : [3, 4]}
            ]
            '''
        bad_crystal_plate = '''[
            {"crystalPlate" : 17, "batchNumber" : "str", "compounds" : [0, 1, 2], "crystals" : [0, 1, 2]},
            {"crystalPlate" : 1, "batchNumber" : 8, "compounds" : [3, 4], "crystals" : [3, 4]}
            ]
            '''
        bad_ids = '''[
            {"crystalPlate" : 17, "batchNumber" : "str", "compounds" : [0, 1, 2], "crystals" : [0, 1, 2, 17]},
            {"crystalPlate" : 1, "batchNumber" : 8, "compounds" : [3, 4], "crystals" : [3, 4]}
            ]
            '''

        self.assertTrue(valid_batch_JSON_data(good_json, error_log))
        self.assertFalse(valid_batch_JSON_data(misssing_cp, error_log))
        self.assertFalse(valid_batch_JSON_data(bad_batch_number, error_log))
        self.assertFalse(valid_batch_JSON_data(bad_crystal_plate, error_log))
        self.assertFalse(valid_batch_JSON_data(bad_ids, error_log))

        errs = [
            "Application error: invalid batch data (failed to find key: crystalPlate). Other keys might be missing too.",
            "Application error: invalid batch number (not a number)",
            "Application error: invalid crystal plate id submitted with batch data  (no such plate found)",
            "Application error: invalid  crystal ids submitted with batch data (no such crystals found)"
        ]
        
        self.assertEqual(error_log, errs)

class ValidCombinationDataDataTest(TestCase):
    def setUp(self):
        set_up_labs(lab_data, batch_data, crystal_plate_data, crystal_data, spa_compound_data)


    def test_valid_combination_number(self):
        error_log = []
        self.assertTrue(valid_combination_number(3, error_log, 1))
        self.assertTrue(valid_combination_number("12", error_log, 2))
        self.assertFalse(valid_combination_number("", error_log, 3))
        self.assertFalse(valid_combination_number("str", error_log, 4))
        self.assertFalse(valid_combination_number([1,2,3], error_log, 5))
        errs = [
            "Line 3: Invalid combination number: ",
            "Line 4: Invalid combination number: str",
            "Line 5: Invalid combination number: [1, 2, 3]"

        ]
        self.assertEqual(error_log, errs)
    
    def test_valid_compound(self):
        c0 = SpaCompound.objects.filter(lab_data = None)[0]
        valid_code0 = c0.code
        valid_smiles0 = c0.smiles
        l1 = Lab.objects.all()[1]
        valid_code1 = l1.single_compound.code
        valid_smiles1 = l1.single_compound.smiles
        error_log = []
        self.assertTrue(valid_compound(valid_code0, valid_smiles0, "visit-1", error_log, 1))
        self.assertTrue(valid_compound(valid_code1, valid_smiles1, "visit-1", error_log, 2))
        self.assertFalse(valid_compound("str", valid_smiles0, "visit-1", error_log, 3))
        self.assertFalse(valid_compound(valid_code0, "str", "visit-1", error_log, 4))
        self.assertFalse(valid_compound(valid_code0, valid_smiles0, "visit-2", error_log, 5))
        self.assertFalse(valid_compound([1, 2, 3], valid_smiles0, "visit-1", error_log, 6))
        errs = [
            #"Line 2: compound not found: {code} : {smiles}".format(code=valid_code1, smiles=valid_smiles1),
            "Line 3: compound not found: str : {smiles}".format(smiles=valid_smiles0),
            "Line 4: compound not found: {code} : str".format(code=valid_code0),
            "Line 5: compound not found: {code} : {smiles}".format(code=valid_code0, smiles=valid_smiles0),
            "Line 6: compound not found: [1, 2, 3] : {smiles}".format(smiles=valid_smiles0)
        ]
        self.assertEqual(error_log, errs)

    def test_valid_related_crystal(self):
        crystals = Crystal.objects.all()
        error_log = []

        self.assertTrue(valid_related_crystal(crystals[0].crystal_name, "visit-1", error_log, 1))
        self.assertFalse(valid_related_crystal(crystals[0].crystal_name, "visit-2", error_log, 2))
        self.assertFalse(valid_related_crystal("str", "visit-1", error_log, 3))

        errs = [
            "Line 2: crystal not found: {crystal_name}".format(crystal_name=crystals[0].crystal_name),
            "Line 3: crystal not found: str"
        ]

        self.assertEqual(error_log, errs)
    
    def test_valid_combinations_headers(self):
        error_log = []

        valid1 = ['Combination', 'Code', 'SMILES', 'Related crystal']
        valid2 = ['Combination', 'Code', 'SMILES']
        valid3 = ['Combination', 'Related crystal']
        valid4 = ['COMBINATION   ', ' coDe', '  smiles', ' Related crystal ']
        valid5 = ['Combination', 'extra string', 'Code', 'SMILES', 'Related crystal']
        invalid1 = ['Code', 'Smiles', 'Related crystal']
        invalid2 = ['Combination', 'Code']
        invalid3 = ['Combination', 'Smiles']

        self.assertTrue(valid_combinations_headers(valid1, error_log))
        self.assertTrue(valid_combinations_headers(valid2, error_log))
        self.assertTrue(valid_combinations_headers(valid3, error_log))
        self.assertTrue(valid_combinations_headers(valid4, error_log))
        self.assertTrue(valid_combinations_headers(valid5, error_log))
        self.assertFalse(valid_combinations_headers(invalid1, error_log))
        self.assertFalse(valid_combinations_headers(invalid2, error_log))
        self.assertFalse(valid_combinations_headers(invalid3, error_log))

        errs = [
            "Column for combination number not found. Make sure your file uses the header 'Combination' for it.",
            "Columns for compounds not found. Make sure your file uses headers 'Code' and 'SMILES' for identifying a compound, or 'Related crystal' to find the compound based on a previously used crystal.",
            "Columns for compounds not found. Make sure your file uses headers 'Code' and 'SMILES' for identifying a compound, or 'Related crystal' to find the compound based on a previously used crystal."
        ]

        self.assertEqual(error_log, errs)

    def test_get_index_from_headers(self):
        header1 = ['Combination', 'Code', 'SMILES', 'Related crystal']
        indices1 = {"combination" : 0, "code": 1, "smiles" : 2, "related_crystal" : 3}
        
        header2 = ['Combination', 'Code', 'Related crystal']
        indices2 = {"combination" : 0, "code": None, "smiles" : None, "related_crystal" : 2}

        header3 = ['Combination', 'SMILES', 'Related crystal']
        indices3 = {"combination" : 0, "code": None, "smiles" : None, "related_crystal" : 2}

        header4 = ['COMBINATION', 'Related crystal']
        indices4 = {"combination" : 0, "code": None, "smiles" : None, "related_crystal" :1}

        header5 = ['str', 'Combination', 'Code', 'SMILES', 'Related crystal']
        indices5 = {"combination" : 1, "code": 2, "smiles" : 3, "related_crystal" : 4}

        header6 = ['Combination', 'Code', 'SMILES']
        indices6 = {"combination" : 0, "code": 1, "smiles" : 2, "related_crystal" : None}
        
        self.assertEqual(get_index_from_headers(header1), indices1)
        self.assertEqual(get_index_from_headers(header2), indices2)
        self.assertEqual(get_index_from_headers(header3), indices3)
        self.assertEqual(get_index_from_headers(header4), indices4)
        self.assertEqual(get_index_from_headers(header5), indices5)
        self.assertEqual(get_index_from_headers(header6), indices6)

    def test_valid_compound_reference(self):
        error_log = []
        dic1 = {"combination" : 0, "code": 1, "smiles" : 2, "related_crystal" : 3}
        dic2 = {"combination" : 0, "code": None, "smiles" : None, "related_crystal" : 3}
        dic3 = {"combination" : 0, "code": 1, "smiles" : 2, "related_crystal" : None}

        valid_line1 = ["1", "code1", "CC", ""]
        valid_line2 = ["3", "", "", "name1",]
        invalid_line3 = ["5", "code2", "CC", ""]
        invalid_line4 = ["5", "str", "CC", ""]
        invalid_line5 = ["5", "code2", "XYZ", ""]
        invalid_line6 = ["5", "", "", ""]

        self.assertTrue(valid_compound_reference(valid_line1, dic1, "visit-1", error_log, 1))
        self.assertTrue(valid_compound_reference(valid_line1, dic3, "visit-1", error_log, 1))
        self.assertTrue(valid_compound_reference(valid_line2, dic1, "visit-1", error_log, 2))
        self.assertTrue(valid_compound_reference(valid_line2, dic2, "visit-1", error_log, 2))
        self.assertFalse(valid_compound_reference(valid_line1, dic2, "visit-1", error_log, 1))
        self.assertFalse(valid_compound_reference(invalid_line3, dic1, "visit-1", error_log, 3))
        self.assertFalse(valid_compound_reference(invalid_line4, dic1, "visit-1", error_log, 4))
        self.assertFalse(valid_compound_reference(invalid_line5, dic1, "visit-1", error_log, 5))
        self.assertFalse(valid_compound_reference(invalid_line6, dic1, "visit-1", error_log, 6))
