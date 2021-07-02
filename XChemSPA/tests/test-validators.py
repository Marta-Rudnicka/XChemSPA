import XChemSPA_backend.validators as v
#import unittest
from django.test import TestCase

class validImportModelTests(TestCase):
    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test1(self):
        self.assertTrue(v.valid_import_mode("add", []))

    def test1(self):
            self.assertTrue(v.valid_import_mode("redo", []))

    def test1(self):
            self.assertTrue(v.valid_import_mode("double", []))

    def test1(self):
            self.assertFalse(v.valid_import_mode("", []))

    def test1(self):
            self.assertFalse(v.valid_import_mode(8, []))

    def test1(self):
            self.assertFalse(v.valid_import_mode("x", []))