-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cardBrand" TEXT,
ADD COLUMN     "cardLast4" TEXT,
ADD COLUMN     "isPotentialLead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mailerlite_subscriber_id" TEXT,
ADD COLUMN     "newsletter_subscribed" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "subscription_status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "trial_ends_at" TIMESTAMP(3);
