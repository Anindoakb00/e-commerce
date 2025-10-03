from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_coupons_and_discounts'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coupon',
            name='discount_type',
            field=models.CharField(choices=[('percent', 'Percent Off'), ('fixed', 'Fixed Amount Off'), ('free_shipping', 'Free Shipping')], max_length=16),
        ),
    ]
