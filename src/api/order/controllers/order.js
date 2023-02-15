("use strict");
const stripe = require("stripe")('sk_test_51JQFaXEYzLnZ1WdjuVh0mkZIOLyF5fur2DmGvcERuwwRz2RPwVNzAsPmpx7zyst0chKUSPaFQN2UbiFQJifB4pD500iGhwEYzK');
/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { products } = ctx.request.body;
    try {
      const lineItems = await Promise.all(
        products.map(async (product) => {
          const item = await strapi
            .service("api::product.product")
            .findOne(product.id);

          return {
            price_data: {
              currency: "usd",
              product_data: {
                name: item.title,
              },
              unit_amount: Math.round(item.price * 100),
            },
            quantity: product.quantity,
          };
        })
      );

      console.log(lineItems)
      const session = await stripe.checkout.sessions.create({
        shipping_address_collection: {allowed_countries: ['US', 'CA']},
        payment_method_types: ["card"],
        mode: "payment",
        success_url: process.env.CLIENT_URL+"?success=true",
        cancel_url: process.env.CLIENT_URL+"?success=false",
        line_items: lineItems,
      });

      await strapi
        .service("api::order.order")
        .create({ data: {  products, stripeId: session.id } });

      return { stripeSession: session };
    } catch (e) {
      ctx.response.status = 500;
      switch (e.type) {
        case 'StripeCardError':
          return `A payment error occurred: ${e.message}`;
        case 'StripeInvalidRequestError':
          return 'An invalid request occurred.';
        default:
          return 'Another problem occurred, maybe unrelated to Stripe.';
      }
    }
  },
}));
