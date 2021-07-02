from django.urls import path
from . import views


urlpatterns = [
	path("library_detail/<int:pk>/", views.LibraryDetail.as_view(), name="library_detail"),
	path("proposals/<str:proposal>/", views.ProposalsDetail.as_view(), name="proposal_detail"),
	path("source_compounds/<str:proposal>/", views.SourceCompoundList.as_view(), name="source_compound_list"),
	path("crystal_plates/<str:proposal>/", views.CrystalPlateList.as_view(), name="crystal_plate_list"),
	path("delete_crystal/<int:pk>/", views.CrystalDelete.as_view(), name="crystal_delete"),
	path("lab_detail/<int:pk>/", views.LabDetail.as_view(), name="lab_detail"),
	path("labs/<str:proposal>/", views.LabsByProposal.as_view(), name="labs"),
	path("batch_detail/<int:pk>/", views.BatchDetail.as_view(), name="batch_detail"),
	path("batches/<str:proposal>/", views.BatchesByProposal.as_view(), name="batches"),
	path("combinations/<str:visit>/", views.CompoundCombinations.as_view(), name="combinations")
]
