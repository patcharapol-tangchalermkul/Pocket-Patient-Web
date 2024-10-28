# Generated by Django 4.2.1 on 2023-06-07 23:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patientoncall_api', '0015_alter_medicalhistory_consultant_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='medicalhistory',
            name='consultant',
            field=models.CharField(blank=True, max_length=64, null=True),
        ),
        migrations.AlterField(
            model_name='medicalhistory',
            name='visitType',
            field=models.CharField(blank=True, max_length=32, null=True),
        ),
    ]