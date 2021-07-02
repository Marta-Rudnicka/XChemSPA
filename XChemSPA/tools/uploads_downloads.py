from django.core.exceptions import ObjectDoesNotExist
from API.models import CompoundCombination, Crystal, SpaCompound
from .validators import valid_texrank_file, get_index_from_headers
import csv

def import_crystal_data_from_textrank(file_name, crystal_plate, visit):
    with open(file_name, newline='') as csvfile:
            dialect = csv.Sniffer().sniff(csvfile.read(1024))
            dialect.delimiter = ','
            csvfile.seek(0)
            crystal_reader = csv.reader(csvfile, dialect)

            error_log = []

            if not valid_texrank_file(file_name, error_log):
                return error_log

            for row in crystal_reader:
                if row[1]: 
                    '''
                    print("------------MAKING CRYSTAL----------")
                    print("plate: ", crystal_plate.name)
                    print("well = ", row[0])
                    print("echo_x =", row[1])
                    print("echo_y =", row[2])
                    print("score =", row[3])
                    print("visit =", visit)
                    '''
                    Crystal.objects.create(
                        crystal_plate = crystal_plate,
                        well = row[0],
                        echo_x = row[1],
                        echo_y = row[2],
                        score = row[3],
                        visit = visit,
                        )
            
def create_validated_combinations(file_name, visit):
        with open(file_name, newline='') as csvfile:
            dialect = csv.Sniffer().sniff(csvfile.read(1024))
            dialect.delimiter = ','
            csvfile.seek(0)
            reader = csv.reader(csvfile, dialect)
            header = next(reader, None)
            indices = get_index_from_headers(header)
            starting_number = CompoundCombination.objects.filter(visit=visit).count()
            csvfile.seek(0)
            next(reader)
            for row in reader:
                update_combinations(row, indices, visit, starting_number)


def update_combinations(line, indices, visit, starting_number):
    
    combination = line[indices["combination"]]
    c_num = int(combination) + starting_number
    try:
        c = CompoundCombination.objects.get(visit=visit, number=c_num)
    except ObjectDoesNotExist:
        c = CompoundCombination.objects.create(visit=visit, number=c_num)
        print('New CompoundCombination: ', visit, c_num)
    
    if indices["code"] != None and indices["smiles"] !=None:
        code = line[indices["code"]]
        smiles = line[indices["smiles"]]
        if code and smiles:
            spa_c = SpaCompound.objects.filter(code=code, smiles=smiles, visit=visit, lab_data=None)[0]
            print('Adding compound: ', spa_c, spa_c.library_name, spa_c.code, spa_c.well)
            c.compounds.add(spa_c)
            c.save()
    
    #TODO Add based on related_crystal

