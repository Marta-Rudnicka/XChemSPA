from rest_framework import serializers
from .models import Crystal, CrystalPlate, Proposals, Library, SpaCompound

class LibrarySerializer(serializers.ModelSerializer):
	class Meta:
		model = Library
		fields = ['id', 'name', 'for_industry', 'public', 'plates']
		depth = 1

class SpaCompoundSerializer(serializers.ModelSerializer):
	class Meta:
		model = SpaCompound
		fields = ['id', 'visit', 'library_name', 'library_plate', 'well', 'code', 'smiles', 'crystal']

class LibrarySubsetSerializer(serializers.Serializer):
	id = serializers.IntegerField()
	library = LibrarySerializer()
	name = serializers.CharField(max_length = 64)
	origin = serializers.CharField(max_length = 256)
	size = serializers.IntegerField()



class ProposalDetailSerializer(serializers.Serializer):
	proposal = serializers.CharField(max_length=32)
	libraries = LibrarySerializer(many=True)
	subsets = LibrarySubsetSerializer(many=True)	
	class Meta:
		model = Proposals
		fields = ["proposal", "libraries", "subsets"]
		lookup_field = "proposal"


class CrystalSerializer(serializers.ModelSerializer):
	class Meta:
		model = Crystal
		fields = ['id', 'crystal_name', 'well', 'echo_x', 'echo_y', 'score', 'lab_data']
		#depth = 1

class CrystalPlateSerializer(serializers.Serializer):
	id = serializers.IntegerField()
	name = serializers.CharField(max_length=64)
	drop_volume = serializers.FloatField()
	plate_type = serializers.CharField(max_length=64)
	visit = serializers.CharField(max_length=64)
	crystals = CrystalSerializer(many=True)

	class Meta:
		model = CrystalPlate
		fields = ['id', 'name', 'drop_volume', 'plate_type', 'crystals']
		depth = 1



