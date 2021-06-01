from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import ProposalDetailSerializer, LibrarySerializer, SpaCompoundSerializer
from .models import Proposals, Library, SpaCompound

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