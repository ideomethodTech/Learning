// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    // Check if data exists
    const articles = await strapi.documents('api::article.article').findMany({ status: 'draft' });
    const categories = await strapi.documents('api::category.category').findMany({ status: 'draft' });

    if (articles.length === 0 && categories.length === 0) {
      console.log('Seeding data...');

      // Create Categories
      let tech = await strapi.documents('api::category.category').create({
        data: { name: 'Technology' },
        status: 'published',
      });

      let health = await strapi.documents('api::category.category').create({
        data: { name: 'Health' },
        status: 'published',
      });

      // Create Articles
      await strapi.documents('api::article.article').create({
        data: {
          title: 'Strapi is Cool',
          content: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Strapi is a flexible headless CMS.' }],
            },
          ],
          category: tech.documentId,
        },
        status: 'published',
      });

      await strapi.documents('api::article.article').create({
        data: {
          title: 'Next.js is Fast',
          content: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Next.js gives you the best developer experience.' }],
            },
          ],
          category: tech.documentId,
        },
        status: 'published',
      });

      await strapi.documents('api::article.article').create({
        data: {
          title: 'Eat Apples',
          content: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'An apple a day keeps the doctor away.' }],
            },
          ],
          category: health.documentId,
        },
        status: 'published',
      });

      console.log('Data seeded and published.');
    } else {
      // Publish existing drafts if needed
      console.log('Data exists, ensuring published...');
      for (const cat of categories) {
        try {
          await strapi.documents('api::category.category').publish({ documentId: cat.documentId });
        } catch (e) { /* ignore if already published */ }
      }
      for (const art of articles) {
        try {
          await strapi.documents('api::article.article').publish({ documentId: art.documentId });
        } catch (e) { /* ignore */ }
      }
      console.log('Published existing drafts.');
    }

    // Set Permissions
    const publicRole = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "public" } });

    const permissions = [
      { action: "api::article.article.find", role: publicRole.id },
      { action: "api::article.article.findOne", role: publicRole.id },
      { action: "api::category.category.find", role: publicRole.id },
      { action: "api::category.category.findOne", role: publicRole.id },
    ];

    for (const permission of permissions) {
      const existing = await strapi.query("plugin::users-permissions.permission").findOne({
        where: permission
      });
      if (!existing) {
        await strapi.query("plugin::users-permissions.permission").create({ data: permission });
      }
    }
    console.log('Permissions set.');
  },
};

