from API.models import Crystal
from .validators import valid_texrank_file
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
            
            
                