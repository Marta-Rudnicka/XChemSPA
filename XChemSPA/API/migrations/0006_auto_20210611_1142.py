# Generated by Django 3.1.5 on 2021-06-11 11:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0005_auto_20210611_1119'),
    ]

    operations = [
        migrations.AddField(
            model_name='crystalplate',
            name='visit',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='compoundcombination',
            name='visit',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
