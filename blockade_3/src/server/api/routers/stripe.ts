import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";

const prisma = new PrismaClient();
const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY), {
  apiVersion: "2024-06-20",
});

const ensureSubscription = async (userId: string) => {
  const subscription = await prisma.subscription.findFirst({
    where: { userId },
  });

  if (!subscription) {
    return false;
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: subscription.stripeCustomerId,
  });

  return subscriptions.data.length > 0;
};

export const stripeRouter = createTRPCRouter({
  createCustomerIfNull: protectedProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const clerkUser = await clerkClient.users.getUser(userId);
    const userEmail = clerkUser.primaryEmailAddress?.emailAddress;
    const userName =
      `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();

    if (!userEmail) {
      throw new Error("User email not found");
    }

    let subscription = await prisma.subscription.findFirst({
      where: { userId },
    });

    if (!subscription) {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: userName,
      });

      subscription = await prisma.subscription.create({
        data: {
          userId,
          stripeCustomerId: customer.id,
          complianceChecks: 5,
        },
      });
    } else {
      try {
        await stripe.customers.retrieve(subscription.stripeCustomerId);
      } catch (error) {
        const customer = await stripe.customers.create({
          email: userEmail,
          name: userName,
        });

        subscription = await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            stripeCustomerId: customer.id,
          },
        });
      }
    }

    return { subscriptionId: subscription.id };
  }),

  generateCustomerPortalLink: protectedProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const subscription = await prisma.subscription.findFirst({
      where: { userId },
    });

    if (!subscription || !subscription.stripeCustomerId) {
      throw new Error("Customer not found");
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing`,
    });

    return { url: portalSession.url };
  }),

  hasSubscription: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    return await ensureSubscription(userId);
  }),

  getSubscriptionType: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const subscription = await prisma.subscription.findFirst({
      where: { userId },
    });

    if (!subscription) {
      return { subType: null };
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: subscription.stripeCustomerId,
    });

    const firstSubscription = subscriptions.data[0];
    if (
      !firstSubscription ||
      !firstSubscription.items?.data[0]?.plan?.nickname
    ) {
      return { subType: null };
    }

    const subType = firstSubscription.items.data[0].plan.nickname; // Accessing 'nickname' from the plan of the first item

    return { subType };
  }),

  createCheckoutLink: protectedProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const subscription = await prisma.subscription.findFirst({
      where: { userId },
    });

    if (!subscription || !subscription.stripeCustomerId) {
      throw new Error("Customer not found");
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing`,
      customer: subscription.stripeCustomerId,
      line_items: [
        {
          price: "price_1PcsPKJVf2xIHTdAeUl6rKPU",
          quantity: 1,
        },
      ],
      mode: "subscription",
      discounts: [
        {
          coupon: "giBnwIfb", // Add your coupon ID here
        },
      ],
    });

    return { url: checkoutSession.url };
  }),

  upgradeSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const subscription = await prisma.subscription.findFirst({
      where: { userId },
    });

    if (!subscription || !subscription.id) {
      throw new Error("Customer not found");
    }

    // Fetch the current subscription from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: subscription.stripeCustomerId,
    });

    const stripeSubscription = subscriptions.data[0];
    if (!stripeSubscription || !stripeSubscription.items?.data[0]) {
      throw new Error("No subscription items found");
    }

    // Update the subscription to "default" on Stripe
    await stripe.subscriptions.update(stripeSubscription.id, {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: "price_1PcsPKJVf2xIHTdAeUl6rKPU", // Replace with your new price ID
        },
      ],
    });

    return { success: true };
  }),

  joinWaitlist: protectedProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    const clerkUser = await clerkClient.users.getUser(userId);
    const userEmail = clerkUser.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      throw new Error("User email not found");
    }

    const existingWaitlistEntry = await prisma.waitlist.findFirst({
      where: { userId },
    });

    if (existingWaitlistEntry) {
      throw new Error("User already on the waitlist");
    }

    await prisma.waitlist.create({
      data: {
        userId,
        userEmail: userEmail,
        createdAt: new Date(),
      },
    });

    return { success: true };
  }),

  isOnWaitlist: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const waitlistEntry = await prisma.waitlist.findFirst({
      where: { userId },
    });

    return { isOnWaitlist: !!waitlistEntry };
  }),
});
