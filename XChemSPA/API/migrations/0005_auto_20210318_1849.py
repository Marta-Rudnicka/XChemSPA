# Generated by Django 3.1.5 on 2021-03-18 18:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0004_auto_20210311_1102'),
    ]

    operations = [
        migrations.RenameField(
            model_name='libraryplate',
            old_name='name',
            new_name='barcode',
        ),
        migrations.RemoveField(
            model_name='spacompound',
            name='crystal',
        ),
        migrations.RemoveField(
            model_name='spacompound',
            name='proposal',
        ),
        migrations.AddField(
            model_name='crystal',
            name='soakdb_file',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='API.soakdbfiles'),
        ),
        migrations.AddField(
            model_name='lab',
            name='single_compound',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='API.spacompound'),
        ),
        migrations.CreateModel(
            name='Visit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('visit_name', models.CharField(blank=True, max_length=32, null=True)),
                ('proposal', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='API.proposals')),
            ],
        ),
        migrations.CreateModel(
            name='CompoundCombination',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.IntegerField(blank=True, null=True)),
                ('related_crystals', models.CharField(blank=True, max_length=64, null=True)),
                ('compounds', models.ManyToManyField(to='API.SpaCompound')),
                ('visit', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='API.visit')),
            ],
        ),
        migrations.AddField(
            model_name='lab',
            name='compound_combination',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='API.compoundcombination'),
        ),
        migrations.AddField(
            model_name='spacompound',
            name='visit',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='API.visit'),
        ),
        migrations.AlterField(
            model_name='crystal',
            name='visit',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='API.visit'),
        ),
    ]
