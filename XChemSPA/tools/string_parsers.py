import re

def get_proposal_from_visit(visit):
    visit_pattern = '([A-Za-z0-9_]+)(\-[0-9]+)'
    p = re.fullmatch(visit_pattern, visit)
    try:
        return p.group(1)
    except AttributeError:
        return ""