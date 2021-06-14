from API.models import Library, LibraryPlate
from setups import set_up_library_plates
from API.models import Proposals, LibrarySubset
from tools.validators import (
        matching_library,
        extract_subset_id,
        update_error_log,
        valid_import_mode,
        valid_import_library_key,
        subset_in_proposal,
        get_object,
        valid_well_name,
        unique_well_name,
        valid_coordinates,
        valid_score,
        valid_crystal_data
)

from django.test import TestCase
from setups import (
    libraries_data,
    compounds_data,
    subsets_data,
    proposals_data,
    plates_data,
    set_up_libraries,
    set_up_subsets,
    set_up_proposals,
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

class ValidImportModelTests(TestCase):

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