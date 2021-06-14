from django.db.models import query
from django.shortcuts import get_object_or_404
from django.views import View
from django.http import HttpResponse
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import CrystalSerializer, ProposalDetailSerializer, LibrarySerializer, SpaCompoundSerializer, CrystalPlateSerializer
from .models import CrystalPlate, Proposals, Library, SpaCompound, Crystal

class ProposalsDetail(generics.RetrieveUpdateAPIView):
	permission_classes = [AllowAny]
	
	queryset = Proposals.objects.all()	
	lookup_field = "proposal"
	serializer_class = ProposalDetailSerializer

class LibraryDetail(generics.RetrieveAPIView):
	queryset = Library.objects.all()
	serializer_class = LibrarySerializer
	permission_classes = [AllowAny]

class SourceCompoundList(generics.ListAPIView):
	def get_queryset(self):
		proposal = self.kwargs['proposal']
		return SpaCompound.objects.filter(visit__contains=proposal)
	
	permission_classes = [AllowAny]
	serializer_class = SpaCompoundSerializer



class CrystalPlateList(generics.ListAPIView):
	def get_queryset(self):
		proposal = self.kwargs['proposal']
		return CrystalPlate.objects.filter(visit__contains=proposal)

	permission_classes = [AllowAny]
	serializer_class = CrystalPlateSerializer



class CrystalPlateList(generics.ListAPIView):
	def get_queryset(self):
		proposal = self.kwargs['proposal']
		return CrystalPlate.objects.filter(visit__contains=proposal)

	permission_classes = [AllowAny]
	serializer_class = CrystalPlateSerializer

class CrystalDelete(generics.DestroyAPIView):
	authentication_classes = []
	queryset = Crystal.objects.filter(lab_data = None)	
	permission_classes = [AllowAny]
	serializer_class = CrystalSerializer
'''
class CrystalDelete(View):
	def get(self, request, *args, **kwargs):
		pk = self.kwargs['pk']
		crystal =  Crystal.objects.get(pk=pk)
		print(crystal.id)	
		print(crystal.well)
		print(crystal.crystal_plate.name)
		try:
			crystal.lab_data
			print('will not be removed')
		except ObjectDoesNotExist:
			print('can be removed')
		
		return HttpResponse('x')
'''