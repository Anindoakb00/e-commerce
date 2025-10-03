from django.core.management.base import BaseCommand
from django.conf import settings
from product.models import Product, ProductImage
from pathlib import Path
import shutil
from django.core.files import File


class Command(BaseCommand):
    help = "Copy bundled sample images into MEDIA_ROOT and attach them to products without images"

    def handle(self, *args, **options):
        base_dir = Path(settings.BASE_DIR)
        # Source dir in repo (where sample images are checked in)
        src_dir = base_dir / 'core' / 'media' / 'product_images'
        # Destination dir actually served by Django
        dst_dir = Path(settings.MEDIA_ROOT) / 'product_images'

        if not src_dir.exists():
            self.stdout.write(self.style.WARNING(f"Source not found: {src_dir}"))
            return

        dst_dir.mkdir(parents=True, exist_ok=True)

        # Copy files if missing
        copied = 0
        for src_file in src_dir.glob('*'):
            if not src_file.is_file():
                continue
            dst_file = dst_dir / src_file.name
            if not dst_file.exists():
                shutil.copy2(src_file, dst_file)
                copied += 1
        self.stdout.write(self.style.SUCCESS(f"Copied {copied} image(s) into {dst_dir}"))

        # Attach images to products that don't have any
        available = sorted([p for p in dst_dir.glob('*') if p.is_file()])
        if not available:
            self.stdout.write(self.style.WARNING("No images available to attach."))
            return

        attached = 0
        products = Product.objects.all().order_by('id')
        for idx, product in enumerate(products):
            if product.images.exists():
                continue
            # Pick an image deterministically by index
            pick = available[idx % len(available)]
            rel_name = f"product_images/{pick.name}"
            with open(pick, 'rb') as fh:
                pi = ProductImage(product=product)
                pi.image.save(pick.name, File(fh), save=True)
                attached += 1

        self.stdout.write(self.style.SUCCESS(f"Attached images to {attached} product(s) without images."))
