import os
import sys

# Ensure Backend root is on sys.path so 'techbuilder' package can be imported
BACKEND_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_ROOT not in sys.path:
    sys.path.insert(0, BACKEND_ROOT)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "techbuilder.settings")

try:
    import django
    django.setup()
except Exception as e:
    print("Failed to setup Django:", e)
    sys.exit(2)

from django.db import connection


def drop_indexes_and_constraints():
    with connection.cursor() as c:
        print("Scanning for slug LIKE indexes…")
        c.execute(
            """
            SELECT schemaname, indexname
            FROM pg_indexes
            WHERE indexname LIKE 'product_product_slug_%_like'
               OR indexname LIKE 'product_category_slug_%_like'
               OR indexname LIKE 'product_brand_slug_%_like'
               OR indexname LIKE 'product_%_slug%like%'
            """
        )
        rows = c.fetchall()
        if not rows:
            print("No LIKE indexes found.")
        else:
            print(f"Found {len(rows)} LIKE index(es):", rows)
            for schema, index in rows:
                stmt = f'DROP INDEX IF EXISTS "{schema}"."{index}"'
                print("Executing:", stmt)
                c.execute(stmt)

        # Drop unique constraints (not just indexes) if they exist
        targets = [
            ("product_product", "product_product_slug_key"),
            ("product_category", "product_category_slug_key"),
            ("product_brand", "product_brand_slug_key"),
        ]
        for table, constraint in targets:
            stmt = f'ALTER TABLE IF EXISTS "{table}" DROP CONSTRAINT IF EXISTS "{constraint}"'
            print("Executing:", stmt)
            c.execute(stmt)

        # As a belt-and-suspenders, also attempt to drop standalone indexes with those names
        for _, name in targets:
            stmt = f'DROP INDEX IF EXISTS "{name}"'
            print("Executing:", stmt)
            c.execute(stmt)

        print("Cleanup complete.")


if __name__ == "__main__":
    drop_indexes_and_constraints()