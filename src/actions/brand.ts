'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth/guards';
import { logAdminActivity } from '@/lib/audit/activity';
import { ContentStatus, Role } from '@prisma/client';

const locationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Location name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().optional().nullable(),
  hours: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  mapUrl: z.string().optional().nullable(),
});

const socialSchema = z.object({
  id: z.string().optional(),
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Must be a valid URL'),
});

const brandSchema = z.object({
  name: z.string().min(2, 'Brand name is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  tagline: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  concept: z.string().optional().nullable(),
  story: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  gallery: z.array(z.string()).default([]),
  sortOrder: z.number().int().default(0),
  status: z.nativeEnum(ContentStatus).default(ContentStatus.PUBLISHED),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  locations: z.array(locationSchema).optional().default([]),
  socials: z.array(socialSchema).optional().default([]),
});

export async function getPublishedBrands() {
  if (!prisma) return [];
  return prisma.brand.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: { sortOrder: 'asc' },
    include: {
      locations: { orderBy: { sortOrder: 'asc' } },
      socials: true,
    },
  });
}

export async function getBrandBySlug(slug: string) {
  if (!prisma) return null;
  return prisma.brand.findUnique({
    where: { slug },
    include: {
      locations: { orderBy: { sortOrder: 'asc' } },
      socials: true,
    },
  });
}

export async function getAllBrandsAdmin() {
  await requireRole([Role.SUPER_ADMIN, Role.ADMIN, Role.EDITOR]);
  if (!prisma) return [];
  return prisma.brand.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      locations: true,
      socials: true,
    },
  });
}

export async function createBrand(data: z.infer<typeof brandSchema>) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
  const parsed = brandSchema.parse(data);

  const { locations, socials, ...brandData } = parsed;

  const brand = await prisma.brand.create({
    data: {
      ...brandData,
      locations: {
        create: locations.map((loc, idx) => ({
          name: loc.name,
          address: loc.address,
          city: loc.city || null,
          hours: loc.hours || null,
          phone: loc.phone || null,
          mapUrl: loc.mapUrl || null,
          sortOrder: idx,
        })),
      },
      socials: {
        create: socials.map((soc) => ({
          platform: soc.platform,
          url: soc.url,
        })),
      },
    },
  });

  await logAdminActivity({
    userId: session.userId,
    action: 'CREATE',
    entity: 'Brand',
    entityId: brand.id,
    metadata: { name: brand.name, slug: brand.slug },
  });

  revalidatePath('/');
  revalidatePath('/brands');
  revalidatePath(`/brands/${brand.slug}`);
  revalidatePath('/admin/brands');

  return { success: true, brand };
}

export async function updateBrand(id: string, data: z.infer<typeof brandSchema>) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);
  const parsed = brandSchema.parse(data);

  const { locations, socials, ...brandData } = parsed;

  // Transaction to update brand, locations, and socials safely
  const updated = await prisma.$transaction(async (tx) => {
    // Delete existing locations & socials then recreate
    await tx.brandLocation.deleteMany({ where: { brandId: id } });
    await tx.brandSocial.deleteMany({ where: { brandId: id } });

    return tx.brand.update({
      where: { id },
      data: {
        ...brandData,
        locations: {
          create: locations.map((loc, idx) => ({
            name: loc.name,
            address: loc.address,
            city: loc.city || null,
            hours: loc.hours || null,
            phone: loc.phone || null,
            mapUrl: loc.mapUrl || null,
            sortOrder: idx,
          })),
        },
        socials: {
          create: socials.map((soc) => ({
            platform: soc.platform,
            url: soc.url,
          })),
        },
      },
    });
  });

  await logAdminActivity({
    userId: session.userId,
    action: 'UPDATE',
    entity: 'Brand',
    entityId: updated.id,
    metadata: { name: updated.name, slug: updated.slug },
  });

  revalidatePath('/');
  revalidatePath('/brands');
  revalidatePath(`/brands/${updated.slug}`);
  revalidatePath('/admin/brands');

  return { success: true, brand: updated };
}

export async function reorderBrands(orderUpdates: { id: string; sortOrder: number }[]) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

  await prisma.$transaction(
    orderUpdates.map((item) =>
      prisma.brand.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    )
  );

  await logAdminActivity({
    userId: session.userId,
    action: 'UPDATE',
    entity: 'Brand',
    metadata: { action: 'REORDER_BRANDS', count: orderUpdates.length },
  });

  revalidatePath('/');
  revalidatePath('/brands');
  revalidatePath('/admin/brands');

  return { success: true };
}

export async function deleteBrand(id: string) {
  const session = await requireRole([Role.SUPER_ADMIN, Role.ADMIN]);

  const brand = await prisma.brand.delete({
    where: { id },
  });

  await logAdminActivity({
    userId: session.userId,
    action: 'DELETE',
    entity: 'Brand',
    entityId: id,
    metadata: { name: brand.name, slug: brand.slug },
  });

  revalidatePath('/');
  revalidatePath('/brands');
  revalidatePath(`/brands/${brand.slug}`);
  revalidatePath('/admin/brands');

  return { success: true };
}
