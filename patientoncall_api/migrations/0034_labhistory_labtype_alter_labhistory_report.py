# Generated by Django 4.2.1 on 2023-06-15 22:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('patientoncall_api', '0033_merge_20230615_2049'),
    ]

    operations = [
        migrations.AddField(
            model_name='labhistory',
            name='labType',
            field=models.CharField(choices=[('Full Blood Count Report', 'Full Blood Count Report'), ('Cancer Blood Test', 'Cancer Blood Test'), ('Electrolyte Test', 'Electrolyte Test'), ('Genetic Test', 'Genetic Test'), ('Liver Function Test', 'Liver Function Test'), ('Thyroid Function Test', 'Thyroid Function Test')], default='Full Blood Count Report', max_length=100),
        ),
        migrations.AlterField(
            model_name='labhistory',
            name='report',
            field=models.FileField(blank=True, default=True, null=True, upload_to='labattachments/'),
        ),
    ]