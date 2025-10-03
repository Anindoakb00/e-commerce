from django.db import migrations, models
from django.utils.text import slugify


def populate_slugs(apps, schema_editor):
    Product = apps.get_model('product', 'Product')
    Category = apps.get_model('product', 'Category')
    Brand = apps.get_model('product', 'Brand')

    def ensure_unique(model, base, pk):
        base = base or 'item'
        candidate = base
        n = 1
        while model.objects.filter(slug=candidate).exclude(pk=pk).exists():
            n += 1
            candidate = f"{base}-{n}"
        return candidate

    # Backfill products
    for obj in Product.objects.all():
        if not getattr(obj, 'slug', None):
            base = slugify(getattr(obj, 'name', '') or '')
            slug = ensure_unique(Product, base, obj.pk)
            Product.objects.filter(pk=obj.pk).update(slug=slug)

    # Backfill categories
    for obj in Category.objects.all():
        if not getattr(obj, 'slug', None):
            base = slugify(getattr(obj, 'name', '') or '')
            slug = ensure_unique(Category, base, obj.pk)
            Category.objects.filter(pk=obj.pk).update(slug=slug)

    # Backfill brands
    for obj in Brand.objects.all():
        if not getattr(obj, 'slug', None):
            base = slugify(getattr(obj, 'name', '') or '')
            slug = ensure_unique(Brand, base, obj.pk)
            Brand.objects.filter(pk=obj.pk).update(slug=slug)


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0001_initial'),
    ]

    operations = [
        # 1) Add fields without unique constraints so existing rows can be updated safely
        migrations.AddField(
            model_name='product',
            name='slug',
            field=models.SlugField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='category',
            name='slug',
            field=models.SlugField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='brand',
            name='slug',
            field=models.SlugField(blank=True, max_length=255, null=True),
        ),
        # 2) Populate slugs for existing data
        migrations.RunPython(populate_slugs, migrations.RunPython.noop),
        # 2.5) Clean up any dangling LIKE indexes from previous failed attempts (idempotent)
        migrations.RunSQL(
            sql=(
                "DO $$\n"
                "DECLARE idx RECORD;\n"
                "BEGIN\n"
                "  -- Drop LIKE operator indexes if they exist (any schema)\n"
                "  FOR idx IN SELECT n.nspname AS schemaname, c.relname AS indexname\n"
                "            FROM pg_class c\n"
                "            JOIN pg_namespace n ON n.oid = c.relnamespace\n"
                "            WHERE c.relkind = 'i' AND c.relname LIKE 'product_product_slug_%_like'\n"
                "  LOOP\n"
                "    EXECUTE format('DROP INDEX IF EXISTS %I.%I', idx.schemaname, idx.indexname);\n"
                "  END LOOP;\n"
                "  FOR idx IN SELECT n.nspname AS schemaname, c.relname AS indexname\n"
                "            FROM pg_class c\n"
                "            JOIN pg_namespace n ON n.oid = c.relnamespace\n"
                "            WHERE c.relkind = 'i' AND c.relname LIKE 'product_category_slug_%_like'\n"
                "  LOOP\n"
                "    EXECUTE format('DROP INDEX IF EXISTS %I.%I', idx.schemaname, idx.indexname);\n"
                "  END LOOP;\n"
                "  FOR idx IN SELECT n.nspname AS schemaname, c.relname AS indexname\n"
                "            FROM pg_class c\n"
                "            JOIN pg_namespace n ON n.oid = c.relnamespace\n"
                "            WHERE c.relkind = 'i' AND c.relname LIKE 'product_brand_slug_%_like'\n"
                "  LOOP\n"
                "    EXECUTE format('DROP INDEX IF EXISTS %I.%I', idx.schemaname, idx.indexname);\n"
                "  END LOOP;\n"
                "  -- Drop unique indexes if they somehow already exist\n"
                "  IF to_regclass('product_product_slug_key') IS NOT NULL THEN\n"
                "    EXECUTE 'DROP INDEX IF EXISTS product_product_slug_key';\n"
                "  END IF;\n"
                "  IF to_regclass('product_category_slug_key') IS NOT NULL THEN\n"
                "    EXECUTE 'DROP INDEX IF EXISTS product_category_slug_key';\n"
                "  END IF;\n"
                "  IF to_regclass('product_brand_slug_key') IS NOT NULL THEN\n"
                "    EXECUTE 'DROP INDEX IF EXISTS product_brand_slug_key';\n"
                "  END IF;\n"
                "END$$;"
            ),
            reverse_sql=migrations.RunSQL.noop
        ),
        # 3) Enforce NOT NULL + UNIQUE via SQL to avoid Django creating a duplicate _like index,
        #    then update state so the ORM knows fields are unique.
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunSQL(
                    sql=(
                        "ALTER TABLE product_product ALTER COLUMN slug SET NOT NULL;\n"
                        "ALTER TABLE product_product ADD CONSTRAINT product_product_slug_key UNIQUE (slug);"
                    ),
                    reverse_sql=(
                        "ALTER TABLE product_product DROP CONSTRAINT IF EXISTS product_product_slug_key;\n"
                        "ALTER TABLE product_product ALTER COLUMN slug DROP NOT NULL;"
                    ),
                ),
            ],
            state_operations=[
                migrations.AlterField(
                    model_name='product',
                    name='slug',
                    field=models.SlugField(blank=True, max_length=255, unique=True),
                ),
            ],
        ),
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunSQL(
                    sql=(
                        "ALTER TABLE product_category ALTER COLUMN slug SET NOT NULL;\n"
                        "ALTER TABLE product_category ADD CONSTRAINT product_category_slug_key UNIQUE (slug);"
                    ),
                    reverse_sql=(
                        "ALTER TABLE product_category DROP CONSTRAINT IF EXISTS product_category_slug_key;\n"
                        "ALTER TABLE product_category ALTER COLUMN slug DROP NOT NULL;"
                    ),
                ),
            ],
            state_operations=[
                migrations.AlterField(
                    model_name='category',
                    name='slug',
                    field=models.SlugField(blank=True, max_length=255, unique=True),
                ),
            ],
        ),
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunSQL(
                    sql=(
                        "ALTER TABLE product_brand ALTER COLUMN slug SET NOT NULL;\n"
                        "ALTER TABLE product_brand ADD CONSTRAINT product_brand_slug_key UNIQUE (slug);"
                    ),
                    reverse_sql=(
                        "ALTER TABLE product_brand DROP CONSTRAINT IF EXISTS product_brand_slug_key;\n"
                        "ALTER TABLE product_brand ALTER COLUMN slug DROP NOT NULL;"
                    ),
                ),
            ],
            state_operations=[
                migrations.AlterField(
                    model_name='brand',
                    name='slug',
                    field=models.SlugField(blank=True, max_length=255, unique=True),
                ),
            ],
        ),
    ]
