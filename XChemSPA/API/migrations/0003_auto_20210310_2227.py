# Generated by Django 3.1.5 on 2021-03-10 22:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0002_auto_20210310_2122'),
    ]

    operations = [
        migrations.RenameField(
            model_name='batch',
            old_name='compound_conc',
            new_name='expr_conc',
        ),
        migrations.RenameField(
            model_name='solventtestingdata',
            old_name='compound_conc',
            new_name='expr_conc',
        ),
        migrations.RemoveField(
            model_name='lab',
            name='expr_conc',
        ),
    ]
