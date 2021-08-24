import re
from API.models import Project

def get_proposal_from_visit(visit):
    visit_pattern = '([A-Za-z0-9_]+)(\-[0-9]+)'
    p = re.fullmatch(visit_pattern, visit)
    try:
        return p.group(1)
    except AttributeError:
        return ""

def get_project_from_visit(visit):
    proposal = get_proposal_from_visit(visit)
    return Project.objects.get(proposal=proposal)