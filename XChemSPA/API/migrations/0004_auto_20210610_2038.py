# Generated by Django 3.1.5 on 2021-06-10 20:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0003_auto_20210527_1403'),
    ]

    operations = [
        migrations.AlterField(
            model_name='crystal',
            name='visit',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]