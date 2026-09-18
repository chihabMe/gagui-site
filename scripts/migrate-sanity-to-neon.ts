import { client as sanityClient } from "../src/sanity/client";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🚀 Starting data migration from Sanity to Neon PostgreSQL (mondeiptv)...");

  // 1. Migrate Site Settings
  console.log("\n[1/6] Migrating Site Settings...");
  try {
    const sanitySettings = await sanityClient.fetch(`*[_type == "siteSettings"][0]`);
    if (sanitySettings) {
      await prisma.siteSettings.upsert({
        where: { id: "siteSettings" },
        update: {
          title: sanitySettings.title || "Monde streaming vip",
          description: sanitySettings.description || null,
          email: sanitySettings.contactInfo?.email || "montetvsat@gmail.com",
          phone: sanitySettings.contactInfo?.phone || "213562337936",
          whatsapp: sanitySettings.contactInfo?.whatsapp || "https://wa.me/213562337936",
          address: sanitySettings.contactInfo?.address || null,
          socialLinks: sanitySettings.contactInfo?.socialLinks || {},
        },
        create: {
          id: "siteSettings",
          title: sanitySettings.title || "Monde streaming vip",
          description: sanitySettings.description || null,
          email: sanitySettings.contactInfo?.email || "montetvsat@gmail.com",
          phone: sanitySettings.contactInfo?.phone || "213562337936",
          whatsapp: sanitySettings.contactInfo?.whatsapp || "https://wa.me/213562337936",
          address: sanitySettings.contactInfo?.address || null,
          socialLinks: sanitySettings.contactInfo?.socialLinks || {},
        },
      });
      console.log("✅ Site Settings migrated successfully.");
    } else {
      console.log("ℹ️ No Site Settings found in Sanity. Initializing default record.");
      await prisma.siteSettings.upsert({
        where: { id: "siteSettings" },
        update: {},
        create: {
          id: "siteSettings",
          title: "Monde streaming vip",
          email: "montetvsat@gmail.com",
          phone: "213562337936",
          whatsapp: "https://wa.me/213562337936",
        },
      });
    }
  } catch (err) {
    console.error("❌ Error migrating Site Settings:", err);
  }

  // 2. Migrate Pricing Plans
  console.log("\n[2/6] Migrating Pricing Plans...");
  const planIdMap = new Map<string, string>(); // maps sanity._id -> prisma.id
  try {
    const sanityPlans = await sanityClient.fetch(`*[_type == "pricing"] | order(order asc)`);
    console.log(`Found ${sanityPlans.length} pricing plans in Sanity.`);

    for (const plan of sanityPlans) {
      const createdPlan = await prisma.pricingPlan.upsert({
        where: { sanityId: plan._id },
        update: {
          name: plan.name,
          description: plan.description || null,
          amount: plan.price?.amount ?? 0,
          currency: plan.price?.currency ?? "EUR",
          period: plan.price?.period ?? "yearly",
          isPopular: Boolean(plan.isPopular),
          isActive: plan.isActive ?? true,
          order: plan.order ?? 0,
          ctaText: plan.ctaText || "S'abonner",
          ctaUrl: plan.ctaUrl || null,
          specifications: plan.specifications || {},
          features: plan.features || [],
        },
        create: {
          sanityId: plan._id,
          name: plan.name,
          description: plan.description || null,
          amount: plan.price?.amount ?? 0,
          currency: plan.price?.currency ?? "EUR",
          period: plan.price?.period ?? "yearly",
          isPopular: Boolean(plan.isPopular),
          isActive: plan.isActive ?? true,
          order: plan.order ?? 0,
          ctaText: plan.ctaText || "S'abonner",
          ctaUrl: plan.ctaUrl || null,
          specifications: plan.specifications || {},
          features: plan.features || [],
        },
      });
      planIdMap.set(plan._id, createdPlan.id);
      console.log(`  ✓ Plan: "${plan.name}" (${plan.price?.amount} ${plan.price?.currency})`);
    }
  } catch (err) {
    console.error("❌ Error migrating Pricing Plans:", err);
  }

  // 3. Migrate FAQs
  console.log("\n[3/6] Migrating FAQs...");
  try {
    const sanityFaqs = await sanityClient.fetch(`*[_type == "faq"] | order(order asc)`);
    console.log(`Found ${sanityFaqs.length} FAQs in Sanity.`);

    for (const faq of sanityFaqs) {
      await prisma.faq.upsert({
        where: { sanityId: faq._id },
        update: {
          question: faq.question,
          answer: faq.answer,
          category: faq.category || "general",
          order: faq.order ?? 0,
          isActive: true,
        },
        create: {
          sanityId: faq._id,
          question: faq.question,
          answer: faq.answer,
          category: faq.category || "general",
          order: faq.order ?? 0,
          isActive: true,
        },
      });
    }
    console.log(`✅ ${sanityFaqs.length} FAQs migrated.`);
  } catch (err) {
    console.error("❌ Error migrating FAQs:", err);
  }

  // 4. Migrate Contact Messages
  console.log("\n[4/6] Migrating Contact Messages...");
  try {
    const sanityContacts = await sanityClient.fetch(`*[_type == "contact"] | order(_createdAt asc)`);
    console.log(`Found ${sanityContacts.length} contact messages in Sanity.`);

    let contactCount = 0;
    for (const c of sanityContacts) {
      await prisma.contactMessage.upsert({
        where: { sanityId: c._id },
        update: {
          name: c.name || "Inconnu",
          email: c.email || "",
          subject: c.subject || "Sans sujet",
          message: c.message || "",
          isRead: Boolean(c.isRead),
          status: c.status || "new",
          submittedAt: c.submittedAt ? new Date(c.submittedAt) : new Date(c._createdAt),
        },
        create: {
          sanityId: c._id,
          name: c.name || "Inconnu",
          email: c.email || "",
          subject: c.subject || "Sans sujet",
          message: c.message || "",
          isRead: Boolean(c.isRead),
          status: c.status || "new",
          submittedAt: c.submittedAt ? new Date(c.submittedAt) : new Date(c._createdAt),
        },
      });
      contactCount++;
    }
    console.log(`✅ ${contactCount} contact messages migrated.`);
  } catch (err) {
    console.error("❌ Error migrating Contact Messages:", err);
  }

  // 5. Migrate Subscription Requests (Orders)
  console.log("\n[5/6] Migrating Subscription Requests (Orders)...");
  try {
    const sanityOrders = await sanityClient.fetch(`*[_type == "subscriptionRequest"] | order(_createdAt asc)`);
    console.log(`Found ${sanityOrders.length} subscription requests in Sanity.`);

    let orderCount = 0;
    for (const o of sanityOrders) {
      // Map status string to Prisma Enum
      let statusEnum: "PENDING" | "CONTACTED" | "ACTIVE" | "EXPIRED" | "CANCELLED" = "PENDING";
      const s = String(o.status || "").toLowerCase();
      if (s === "approved" || s === "completed" || s === "active") statusEnum = "ACTIVE";
      else if (s === "rejected" || s === "cancelled") statusEnum = "CANCELLED";
      else if (s === "contacted") statusEnum = "CONTACTED";

      const selectedPlanId = o.selectedPlan?._ref ? planIdMap.get(o.selectedPlan._ref) : undefined;

      await prisma.subscriptionRequest.upsert({
        where: { sanityId: o._id },
        update: {
          name: o.name || "Client",
          email: o.email || "",
          phone: o.phone || "",
          planName: o.planName || "Abonnement IPTV",
          planPrice: o.planPrice || {},
          status: statusEnum,
          notes: o.notes || null,
          submittedAt: o.submittedAt ? new Date(o.submittedAt) : new Date(o._createdAt),
          selectedPlanId: selectedPlanId || null,
        },
        create: {
          sanityId: o._id,
          name: o.name || "Client",
          email: o.email || "",
          phone: o.phone || "",
          planName: o.planName || "Abonnement IPTV",
          planPrice: o.planPrice || {},
          status: statusEnum,
          notes: o.notes || null,
          submittedAt: o.submittedAt ? new Date(o.submittedAt) : new Date(o._createdAt),
          selectedPlanId: selectedPlanId || null,
        },
      });
      orderCount++;
    }
    console.log(`✅ ${orderCount} subscription requests migrated.`);
  } catch (err) {
    console.error("❌ Error migrating Subscription Requests:", err);
  }

  // 6. Create Initial Admin Users
  console.log("\n[6/6] Setting up initial Admin Users...");
  try {
    const defaultPassword = process.env.ADMIN_INITIAL_PASSWORD || "admin12345";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const adminEmails = ["mondeiptvpro@gmail.com", "chihab.mg.me@gmail.com"];
    for (const email of adminEmails) {
      await prisma.adminUser.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name: email.includes("chihab") ? "Chihab" : "Gagui",
          passwordHash,
          role: "SUPERADMIN",
        },
      });
      console.log(`  ✓ Admin user created/verified: ${email} (Initial password: ${defaultPassword})`);
    }
  } catch (err) {
    console.error("❌ Error setting up Admin Users:", err);
  }

  // Summary Counts
  const [totalSettings, totalPlans, totalFaqs, totalContacts, totalOrders, totalAdmins] =
    await Promise.all([
      prisma.siteSettings.count(),
      prisma.pricingPlan.count(),
      prisma.faq.count(),
      prisma.contactMessage.count(),
      prisma.subscriptionRequest.count(),
      prisma.adminUser.count(),
    ]);

  console.log("\n========================================================");
  console.log("🎉 MIGRATION COMPLETE! SUMMARY IN NEON POSTGRESQL:");
  console.log("========================================================");
  console.log(`  • Site Settings        : ${totalSettings}`);
  console.log(`  • Pricing Plans        : ${totalPlans}`);
  console.log(`  • FAQs                 : ${totalFaqs}`);
  console.log(`  • Contact Messages     : ${totalContacts}`);
  console.log(`  • Subscription Requests: ${totalOrders}`);
  console.log(`  • Admin Users          : ${totalAdmins}`);
  console.log("========================================================\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
