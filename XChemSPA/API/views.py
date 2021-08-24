from django.db.models import query
from django.shortcuts import get_object_or_404
from django.views import View
from django.http import HttpResponse
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import (
	BatchSerializer,
	CompoundCombinationSerializer, 
	CrystalSerializer, 
	LabSerializer, 
	ProjectDetailSerializer, 
	LibrarySerializer, 
	SpaCompoundSerializer, 
	CrystalPlateSerializer,
	LabSerializer,
	BatchSerializer,
	)
from .models import (
	CompoundCombination,
	CrystalPlate, 
	Project, 
	Library, 
	SpaCompound, 
	Crystal, 
	Lab, 
	Batch
	)

from tools.string_parsers import get_project_from_visit

class ProjectDetail(generics.RetrieveUpdateAPIView):
	permission_classes = [AllowAny]
	
	queryset = Project.objects.all()	
	lookup_field = "proposal"
	serializer_class = ProjectDetailSerializer

class LibraryDetail(generics.RetrieveAPIView):
	queryset = Library.objects.all()
	serializer_class = LibrarySerializer
	permission_classes = [AllowAny]

class SourceCompoundList(generics.ListAPIView):
	def get_queryset(self):
		proposal = self.kwargs['proposal']
		return SpaCompound.objects.filter(project__proposal=proposal)
	
	permission_classes = [AllowAny]
	serializer_class = SpaCompoundSerializer



class CrystalPlateList(generics.ListAPIView):
	def get_queryset(self):
		proposal = self.kwargs['proposal']
		return CrystalPlate.objects.filter(project__proposal=proposal)

	permission_classes = [AllowAny]
	serializer_class = CrystalPlateSerializer



class CrystalPlateList(generics.ListAPIView):
	def get_queryset(self):
		proposal = self.kwargs['proposal']
		return CrystalPlate.objects.filter(project__proposal=proposal)

	permission_classes = [AllowAny]
	serializer_class = CrystalPlateSerializer

class CrystalDelete(generics.DestroyAPIView):
	authentication_classes = []
	queryset = Crystal.objects.filter(lab_data = None)	
	permission_classes = [AllowAny]
	serializer_class = CrystalSerializer

class LabDetail(generics.RetrieveAPIView):
	queryset = Lab.objects.all()
	serializer_class = LabSerializer
	permission_classes = [AllowAny]


class LabsByProposal(generics.ListAPIView):
	def get_queryset(self):
		proposal = self.kwargs['proposal']
		return Lab.objects.filter(project__proposal=proposal)
	
	permission_classes = [AllowAny]
	serializer_class = LabSerializer

class BatchDetail(generics.RetrieveAPIView):
	queryset = Batch.objects.all()
	serializer_class = BatchSerializer
	permission_classes = [AllowAny]

class BatchesByProposal(generics.ListAPIView):
	def get_queryset(self):
		proposal = self.kwargs['proposal']
		return Batch.objects.filter(project__proposal=proposal)
	
	permission_classes = [AllowAny]
	serializer_class = BatchSerializer

class CompoundCombinations(generics.ListAPIView):
	def get_queryset(self):
		visit = self.kwargs['visit']
		return CompoundCombination.objects.filter(project=get_project_from_visit(visit))
	
	permission_classes = [AllowAny]
	serializer_class = CompoundCombinationSerializer


class BatchUpdate(generics.RetrieveUpdateAPIView):
	queryset = Batch.objects.all()	
	lookup_field = "pk"
	authentication_classes = []
	permission_classes = [AllowAny]
	serializer_class = BatchSerializer

