# Generated by Django 3.1.5 on 2021-03-10 21:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='proposals',
            old_name='name',
            new_name='proposal',
        ),
    ]
