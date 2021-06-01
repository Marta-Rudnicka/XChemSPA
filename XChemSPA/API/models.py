from __future__ import unicode_literals
from django.db import models

#INVENTORY DATA

class Protein(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    space_group = models.CharField(max_length=100, null=True, blank=True)
    a = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
    b = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
    c = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
    alpha = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
    beta = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)
    gamma = models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True)

#modified from original xchem_db model: added code attribute, smiles no longer unique, moved
class Compounds(models.Model):
    smiles = models.CharField(max_length=255, blank=True, null=True)
    code = models.CharField(max_length=32, blank=True, null=True)

    log_p = models.FloatField(blank=True, null=True)
    mol_wt = models.FloatField(blank=True, null=True)
    heavy_atom_count = models.IntegerField(blank=True, null=True)
    heavy_atom_mol_wt = models.FloatField(blank=True, null=True)
    nhoh_count = models.IntegerField(blank=True, null=True)
    no_count = models.IntegerField(blank=True, null=True)
    num_h_acceptors = models.IntegerField(blank=True, null=True)
    num_h_donors = models.IntegerField(blank=True, null=True)
    num_het_atoms = models.IntegerField(blank=True, null=True)
    num_rot_bonds = models.IntegerField(blank=True, null=True)
    num_val_electrons = models.IntegerField(blank=True, null=True)
    ring_count = models.IntegerField(blank=True, null=True)
    tpsa = models.FloatField(blank=True, null=True)
    
    def __str__ (self):
        return self.code

class Library(models.Model):
    '''Compound library. If public=True, it is an XChem in-house library, otherwise
    it is brought in by the user'''

    name = models.CharField(max_length=100, blank=True, null=True)
    for_industry = models.BooleanField(default=False)
    public = models.BooleanField(default=False)

    def __str__ (self):
        return self.name

class LibraryPlate(models.Model):
    '''A library plate. last_tested is either the date of adding the plate
    to the database, or the last dispense test performed on it'''
		
    barcode = models.CharField(max_length=100, blank=True, null=True) #string to identify physical plate
    library = models.ForeignKey(Library, on_delete=models.PROTECT, related_name="plates" )
    current = models.BooleanField(default=True)
    last_tested =  models.DateField(auto_now=True)
    unique_together = ['barcode', 'library']

    def size(self):
        return len(self.compounds.all())

    def __str__ (self):
        return f"[{self.id}]{self.library}, {self.barcode}"

class SourceWell(models.Model):
    '''location of a particular compound in a particular library plate; concentration not always available'''

    compound = models.ForeignKey(Compounds, blank=True, null=True, on_delete=models.CASCADE, related_name="locations")
    library_plate =  models.ForeignKey(LibraryPlate, blank=True, null=True, on_delete=models.CASCADE, related_name="compounds")
    well  = models.CharField(max_length=4, blank=True, null=True)
    concentration = models.IntegerField(null=True, blank=True)
    active = models.BooleanField(default=True)   
    deactivation_date = models.DateField(blank=True, null=True)

    def __str__ (self):
        return f"{self.library_plate}: {self.well}"

class LibrarySubset(models.Model):
    '''A selection of compounds from a specific library; always created automatically
    Origin is an automatically generated string to inform how the subset was added to a selection.
    (e.g. if it belongs to a preset, or was uploaded by a user) '''

    name = models.CharField(max_length=100, blank=True, null=True)
    library = models.ForeignKey(Library, blank=True, null=True, on_delete=models.CASCADE)
    compounds = models.ManyToManyField(Compounds, blank=True)
    origin = models.CharField(max_length=64, blank=True, null=True)
    
    def __str__ (self):
        return f"{self.id}: {self.name} - {self.library.name}"
    
    def size(self):
        return len(self.compounds.all())

class Preset(models.Model):
    '''A selection of compounds created by the XChem staff for a specific purpose from one
    or more libraries (i.g. a selection of subsets with some metadata describing it)'''
    name = models.CharField(max_length=64, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    subsets = models.ManyToManyField(LibrarySubset, blank=True)

#EXPERIMENTAL DATA: old xchem_db models and new addition 
class Proposals(models.Model):

    # TODO - can we refactor this for title [original comment]
    proposal = models.CharField(max_length=255, blank=False, null=False, unique=True)
    title = models.CharField(max_length=10, blank=True, null=True)
    fedids = models.TextField(blank=True, null=True)

    #SPA-related data
    industry_user = models.BooleanField(default=True) # just in case false by default - fewer privileges
    protein = models.OneToOneField(Protein, blank=True, null=True, on_delete=models.PROTECT)
    libraries = models.ManyToManyField(Library, blank=True)
    subsets = models.ManyToManyField(LibrarySubset, blank=True)

    def __str__(self):
         return self.proposal + "proposal object"
         

class Visit(models.Model):
	visit_name = models.CharField(max_length=32, blank=True, null=True)
	proposal = models.ForeignKey(Proposals, on_delete=models.CASCADE)
	


class SoakdbFiles(models.Model):
    filename = models.CharField(max_length=255, blank=False, null=False, unique=True)
    modification_date = models.BigIntegerField(blank=False, null=False)
    proposal = models.ForeignKey(Proposals, on_delete=models.CASCADE, unique=False)
    visit = models.TextField(blank=False, null=False)
    status = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'soakdb_files'

#new class (SPA experimental data)	
class CrystalPlate(models.Model):
    name = models.CharField(max_length=100, default="new_plate")
    drop_volume = models.FloatField(blank=True, null=True)
    plate_type = models.CharField(max_length=50, blank=True, null=True)


#modified: added more attributes    
class Crystal(models.Model):

    crystal_name = models.CharField(max_length=255, blank=True, null=True, db_index=True) # changed to allow null: a crystal enters database before it is assigned name
    #target = models.ForeignKey(Target, blank=True, null=True, on_delete=models.CASCADE)
    #compound = models.ForeignKey(Compounds, on_delete=models.CASCADE, null=True, blank=True) # Compounds is now an inventory model, not used directly in an experiment
    #visit = models.ForeignKey(SoakdbFiles, blank=True, null=True, on_delete=models.CASCADE) # blank/null temporarily added <---- old
    soakdb_file = models.ForeignKey(SoakdbFiles, blank=True, null=True, on_delete=models.CASCADE) # replaces old 'visit' field
    visit = models.ForeignKey(Visit, blank=True, null=True, on_delete=models.CASCADE) # new 'visit' field for experiments made without SoakDB
    
    product = models.CharField(max_length=255, blank=True, null=True)

    # model types
    PREPROCESSING = 'PP'
    PANDDA = 'PD'
    PROASIS = 'PR'
    REFINEMENT = 'RE'
    COMPCHEM = 'CC'
    DEPOSITION = 'DP'

    CHOICES = (
        (PREPROCESSING, 'preprocessing'),
        (PANDDA, 'pandda'),
        (REFINEMENT, 'refinement'),
        (COMPCHEM, 'comp_chem'),
        (DEPOSITION, 'deposition')
    )

    status = models.CharField(choices=CHOICES, max_length=2, default=PREPROCESSING)

    #added SPA attributes
    crystal_plate = models.ForeignKey(CrystalPlate, blank=True, null=True, on_delete=models.PROTECT)
    well = models.CharField(max_length=4,  blank=True, null=True)
    echo_x = models.IntegerField(blank=True, null=True) #double-check if it shouldn't be float
    echo_y = models.IntegerField(blank=True, null=True) #double-check if it shouldn't be float
    score = models.IntegerField(blank=True, null=True)

    class Meta:
#        unique_together = ('crystal_name', 'visit', 'compound', 'product') <-- old
        unique_together = ('crystal_name', 'visit', 'product') #removed compound from unique_together to allow for cocktails


#new class (SPA experimental data)	
class SpaCompound(models.Model):
    '''Compound data copied from inventory data when the compound is used
    in the experiment'''

    #visit = models.ForeignKey(Visit, blank=True, null=True, on_delete=models.CASCADE)
    visit = models.CharField(max_length=100, blank=True, null=True)
    library_name = models.CharField(max_length=100, blank=True, null=True)
    library_plate = models.CharField(max_length=100, blank=True, null=True)
    well = models.CharField(max_length=4, blank=True, null=True)
    code = models.CharField(max_length=100, blank=True, null=True)
    smiles = models.CharField(max_length=256, blank=True, null=True)
    crystal = models.ForeignKey(Crystal, related_name="compounds", on_delete=models.PROTECT, blank=True, null=True) #to allow cocktails


class CompoundCombination(models.Model):
	'''for combisoaks and cocktails'''
	visit = models.ForeignKey(Visit, blank=True, null=True, on_delete=models.PROTECT)
	number = models.IntegerField(blank=True, null=True)
	compounds = models.ManyToManyField(SpaCompound)
	related_crystals = models.CharField(max_length=64, null=True, blank=True)
	'''if a combination is based on the result of the previous soak,
	the crystals based on which the combination is created are recorder
	as related_crystals'''


#new class
class SolventNotes(models.Model):
    '''To store user's notes on conclusions from solvent testing; values
    not to be processed any further except for reminding the user to 
    apply cryo'''
    
    proposal = models.ForeignKey(Proposals, on_delete=models.CASCADE)
    solvent = models.CharField(max_length=32, blank=True, null=True)
    solvent_concentration = models.FloatField(blank=True, null=True)
    soak_time = models.DurationField(blank=True, null=True)
    cryo = models.CharField(max_length=32, blank=True, null=True)
    cryo_concentration = models.FloatField(blank=True, null=True)
    comments = models.TextField(blank=True, null=True)

class SoakAndCryoValues(models.Model):
    '''abstract class created to manage differences between solvent testing and a screen with compounds;
    in a regular screen these values are the same for the whole batch, but in solvent characterisation
    experiments they are individual to each crystal'''    
    crystal_plate = models.ForeignKey(CrystalPlate, blank=True, null=True, on_delete=models.CASCADE)
    solv_frac = models.FloatField(blank=True, null=True)
    stock_conc = models.FloatField(blank=True, null=True)
    cryo_frac = models.FloatField(blank=True, null=True)
    cryo_stock_frac = models.FloatField(blank=True, null=True)
    cryo_location = models.CharField(max_length=4, blank=True, null=True)

    soak_vol = models.FloatField(blank=True, null=True)
    expr_conc = models.FloatField(blank=True, null=True) #compound concentration - can we rename?
    cryo_transfer_vol = models.FloatField(blank=True, null=True)

    class Meta:
        abstract = True

class SolventBatch(models.Model):
    '''data common to the whole batch of crystals in a solvent testing experiment'''    
    number = models.IntegerField(default=0)
    soak_status = models.CharField(max_length=64, blank=True, null=True)
    soak_time = models.IntegerField(blank=True, null=True)
    cryo_status = models.CharField(max_length=64, blank=True, null=True)
    
    def batch_name(self):
        return 'Batch-' + self.number + '_' + self.crystal_plate.name #needs verification

#new class (SPA experimental data)	
class Batch(SolventBatch, SoakAndCryoValues):
    '''A group of crystals that go through soaking and cryo together in a compound screen
    batch, soak and cryo the same for the whole batch in this kind of experiment'''
    pass

#new class (SPA experimental data)
class SolventTestingData(SoakAndCryoValues):
    '''solvent and cryo data for crystals used in solvent testing'''

    solvent_name = models.CharField(max_length=64, blank=True, null=True)
    batch = models.ForeignKey(SolventBatch, blank=True, null=True, on_delete=models.CASCADE)

#heavily modified; some attributes added, some moved to Batch
class Lab(models.Model):

    crystal_name = models.OneToOneField(Crystal, on_delete=models.CASCADE, unique=True, blank=True, null=True)  # changed to foreign key
    single_compound = models.ForeignKey(SpaCompound, on_delete=models.CASCADE, null=True, blank=True) # in regular experiments
    compound_combination = models.ForeignKey(CompoundCombination, on_delete=models.CASCADE, null=True, blank=True) # with combisoaks and cocktails

    #compound = models.OneToOneField(SpaCompound, on_delete=models.CASCADE, unique=True, blank=True, null=True)  #changed to allow cocktails
    #to access crystal_name now: self.compound.crystal
        
    data_collection_visit = models.CharField(max_length=64, blank=True, null=True)
    harvest_status = models.CharField(max_length=64, blank=True, null=True)
    mounting_result = models.CharField(max_length=64, blank=True, null=True)
    mounting_time = models.CharField(max_length=64, blank=True, null=True)
    visit = models.CharField(max_length=64, blank=True, null=True)

    #new attributes
    batch = models.ForeignKey(Batch, blank=True, null=True, on_delete=models.PROTECT) #null for solvent testing
    solvent_data = models.ForeignKey(SolventTestingData, blank=True, null=True, on_delete=models.PROTECT) #null for compound screen
    puck = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=100, blank=True, null=True)
    pin_barcode = models.CharField(max_length=100, blank=True, null=True)
    arrival_time = models.DateTimeField(blank=True, null=True)
    mounted_timestamp = models.DateTimeField(blank=True, null=True)
    ispyb_status = models.CharField(max_length=100, blank=True, null=True)
