from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0002_slugs'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='stock_qty',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
