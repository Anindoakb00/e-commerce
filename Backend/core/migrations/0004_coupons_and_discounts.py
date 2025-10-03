from django.db import migrations, models
import decimal


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_order_addresses_and_costs'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='coupon_code',
            field=models.CharField(blank=True, default='', max_length=64),
        ),
        migrations.AddField(
            model_name='order',
            name='discount_amount',
            field=models.DecimalField(decimal_places=2, default=decimal.Decimal('0.00'), max_digits=12),
        ),
        migrations.CreateModel(
            name='Coupon',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=64, unique=True)),
                ('discount_type', models.CharField(choices=[('percent', 'Percent Off'), ('fixed', 'Fixed Amount Off')], max_length=16)),
                ('value', models.DecimalField(decimal_places=2, max_digits=12)),
                ('is_active', models.BooleanField(default=True)),
                ('valid_from', models.DateTimeField(blank=True, null=True)),
                ('valid_to', models.DateTimeField(blank=True, null=True)),
                ('min_subtotal', models.DecimalField(decimal_places=2, default=decimal.Decimal('0.00'), max_digits=12)),
                ('max_uses', models.PositiveIntegerField(blank=True, null=True)),
                ('uses_count', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
