import { prisma } from "../src/lib/db";
import bcrypt from "bcryptjs";

function requiredSeedPassword(name: string): string {
  const value = process.env[name];
  if (!value || value.length < 12) {
    throw new Error(`${name} must be configured with at least 12 characters`);
  }
  return value;
}

async function seed() {
  console.log("🌱 Seeding database...");

  const adminHash = await bcrypt.hash(requiredSeedPassword("SEED_ADMIN_PASSWORD"), 12);
  await prisma.usuario.upsert({
    where: { login: "admin@selim.com" },
    update: {
      senhaHash: adminHash,
      email: "admin@selim.com",
    },
    create: {
      nome: "Administrador",
      login: "admin@selim.com",
      email: "admin@selim.com",
      senhaHash: adminHash,
      tipo: "ADMIN",
      status: "ATIVO",
    },
  });

  const selimHash = await bcrypt.hash(requiredSeedPassword("SEED_SELIM_PASSWORD"), 12);
  await prisma.usuario.upsert({
    where: { login: "selim" },
    update: {},
    create: {
      nome: "SELIM",
      login: "selim",
      email: "selim@cadastramento.tech",
      senhaHash: selimHash,
      tipo: "SELIM",
      status: "ATIVO",
    },
  });

  const mbHash = await bcrypt.hash(requiredSeedPassword("SEED_MB_PASSWORD"), 12);
  await prisma.usuario.upsert({
    where: { login: "mb" },
    update: {},
    create: {
      nome: "MB Conferência",
      login: "mb",
      email: "mb@cadastramento.tech",
      senhaHash: mbHash,
      tipo: "MB",
      status: "ATIVO",
    },
  });

  // Create default config entries
  const configs = [
    { key: "ADMIN_DEFAULT_LOGIN", value: "admin" },
    { key: "SELIM_LOGIN", value: "selim" },
    { key: "MB_LOGIN", value: "mb" },
  ];

  for (const cfg of configs) {
    await prisma.config.upsert({
      where: { key: cfg.key },
      update: { value: cfg.value },
      create: cfg,
    });
  }

  console.log("✅ Seed completed!");
  console.log("   Development users created from environment-provided passwords.");
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
