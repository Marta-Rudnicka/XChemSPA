from rest_framework import serializers
from .models import Proposals, Library, SpaCompound

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
