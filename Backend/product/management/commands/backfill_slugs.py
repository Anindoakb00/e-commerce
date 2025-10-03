from django.core.management.base import BaseCommand
from django.db import transaction

from product.models import Product, Category, Brand


class Command(BaseCommand):
    help = "Backfill slug fields for Product, Category, and Brand"

    def handle(self, *args, **options):
        created = {"product": 0, "category": 0, "brand": 0}

        # Categories
        with transaction.atomic():
            for c in Category.objects.all():
                if not c.slug or c.slug.strip() == "":
                    c.slug = ""  # ensure model's save() regenerates
                    c.save()
                    created["category"] += 1

        # Brands
        with transaction.atomic():
            for b in Brand.objects.all():
                if not b.slug or b.slug.strip() == "":
                    b.slug = ""
                    b.save()
                    created["brand"] += 1

        # Products
        with transaction.atomic():
            for p in Product.objects.all():
                if not p.slug or p.slug.strip() == "":
                    p.slug = ""
                    p.save()
                    created["product"] += 1

        self.stdout.write(self.style.SUCCESS(
            f"Backfill complete: products={created['product']}, categories={created['category']}, brands={created['brand']}"
        ))
