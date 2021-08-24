from rest_framework import serializers
from .models import CompoundCombination, Crystal, CrystalPlate, Lab, Project, Library, SpaCompound, Batch

class LibrarySerializer(serializers.ModelSerializer):
	class Meta:
		model = Library
		fields = ['id', 'name', 'for_industry', 'public', 'plates']
		depth = 1

class SpaCompoundSerializer(serializers.ModelSerializer):
	class Meta:
		model = SpaCompound
		fields = [
			'id', 
			'project', 
			'library_name', 
			'library_plate', 
			'well', 
			'code', 
			'smiles', 
			'lab_data'
			]

class LibrarySubsetSerializer(serializers.Serializer):
	id = serializers.IntegerField()
	library = LibrarySerializer()
	name = serializers.CharField(max_length = 64)
	origin = serializers.CharField(max_length = 256)
	size = serializers.IntegerField()


class ProjectDetailSerializer(serializers.Serializer):
	proposal = serializers.CharField(max_length=32)
	libraries = LibrarySerializer(many=True)
	subsets = LibrarySubsetSerializer(many=True)	
	class Meta:
		model = Project
		fields = ["proposal", "libraries", "subsets"]
		lookup_field = "proposal"


class CrystalSerializer(serializers.ModelSerializer):
	class Meta:
		model = Crystal
		fields = [
			'id', 
			'crystal_name', 
			'well', 
			'echo_x', 
			'echo_y', 
			'score', 
			'lab_data'
			]
		#depth = 1

class CrystalPlateSerializer(serializers.Serializer):
	id = serializers.IntegerField()
	name = serializers.CharField(max_length=64)
	drop_volume = serializers.FloatField()
	plate_type = serializers.CharField(max_length=64)
	project = ProjectDetailSerializer(many=False)
	crystals = CrystalSerializer(many=True)

	class Meta:
		model = CrystalPlate
		fields = ['id', 'name', 'drop_volume', 'plate_type', 'crystals']
		depth = 1

class LabSerializer(serializers.ModelSerializer):
	class Meta:
		model = Lab
		fields = [
			'id', 
			'crystal_name', 
			'single_compound', 
			'batch',
			'compound_combination', 
			'project', 
			'harvest_status',
			'mounting_result',
			'mounting_time',
			'solvent_data',
			'puck',
			'position',
			'pin_barcode',
			'arrival_time',
			'mounted_timestamp',
			'ispyb_status',
		]
		depth = 1

class BatchSerializer(serializers.ModelSerializer):
	class Meta:
		model = Batch
		fields = [
			'id', 
			'number', 
			'crystal_plate',
			'solv_frac',
			'stock_conc',
			'soak_status', 
			'soak_vol',
			'expr_conc',
			'soak_timestamp', 
			'cryo_timestamp',
			'soaking_time',
			'cryo_status',
			'cryo_frac',
			'cryo_stock_frac',
			'cryo_location',
			'cryo_transfer_vol',
			'batch_name',
			'crystals',
		]
		depth = 3

class CompoundCombinationSerializer(serializers.ModelSerializer):
	class Meta:
		model = CompoundCombination
		fields = ['id', 'project', 'number', 'compounds', 'related_crystals', 'lab_data']
		depth = 1