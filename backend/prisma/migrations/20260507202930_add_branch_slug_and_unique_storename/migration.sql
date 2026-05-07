-- Step 1: Add slug column (nullable)
ALTER TABLE "Branch" ADD COLUMN "slug" TEXT;

-- Step 2: Populate slug from store_name for existing rows
-- (lowercase, replace spaces/special chars with hyphens, trim trailing hyphens)
UPDATE "Branch"
SET "slug" = LOWER(
  TRIM(BOTH '-' FROM
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REPLACE(REPLACE(REPLACE("store_name", ' ', '-'), '.', ''), ',', ''),
        '[^a-zA-Z0-9\-]', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  )
);

-- Step 3: Make slug NOT NULL + UNIQUE
ALTER TABLE "Branch" ALTER COLUMN "slug" SET NOT NULL;

-- Step 4: Add unique constraints
CREATE UNIQUE INDEX "Branch_store_name_key" ON "Branch"("store_name");
CREATE UNIQUE INDEX "Branch_slug_key" ON "Branch"("slug");
