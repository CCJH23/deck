# Generated by Django 4.1.6 on 2023-06-04 01:22

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("inventory", "0003_remove_item_image_item_profilepic"),
    ]

    operations = [
        migrations.RenameField(
            model_name="item",
            old_name="profilepic",
            new_name="imgpic",
        ),
    ]
