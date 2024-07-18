import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import Link from "next/link";
import { CheckIcon } from "@heroicons/react/20/solid";
import { LoadingPage } from "../components/loading";
import { toast } from "react-hot-toast";

const tiers = [
  {
    name: "Default",
    id: "tier-default",
    description: "Basic access to our features.",
    features: [
      "Access to basic features",
      "5 compliance checks per month by our CCO",
      "Unlimited messages to our default bot",
      "Bot trained by compliance specialists",
      "48-hour response time to issues",
      "And more",
    ],
    originalPrice: 600,
    discountedPrice: 500,
  },
  {
    name: "Premium",
    id: "tier-premium",
    description: "All the advanced features for pros.",
    features: [
      "All basic features",
      "20 manual compliance checks",
      "Custom trained bots for your application",
      "24-hour response time to issues",
      "And more",
    ],
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const BillingPage: React.FC = () => {
  const { isLoaded, user } = useUser();
  const [manageLink, setManageLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [checkoutLink, setCheckoutLink] = useState<string | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isWaitlistButtonDisabled, setWaitlistButtonDisabled] = useState(false);

  const createCustomerIfNullMutation =
    api.stripe.createCustomerIfNull.useMutation();
  const generateCustomerPortalLinkMutation =
    api.stripe.generateCustomerPortalLink.useMutation();
  const hasSubscriptionQuery = api.stripe.hasSubscription.useQuery(undefined, {
    enabled: false,
  });
  const getSubscriptionTypeQuery = api.stripe.getSubscriptionType.useQuery(
    undefined,
    {
      enabled: false,
    },
  );
  const createCheckoutLinkMutation =
    api.stripe.createCheckoutLink.useMutation();
  const joinWaitlistMutation = api.stripe.joinWaitlist.useMutation();
  const isOnWaitlistQuery = api.stripe.isOnWaitlist.useQuery(undefined, {
    enabled: !!user,
  });

  useEffect(() => {
    const fetchBillingLink = async () => {
      if (isLoaded && user) {
        try {
          await createCustomerIfNullMutation.mutateAsync();
          const { url: portalUrl } =
            await generateCustomerPortalLinkMutation.mutateAsync();
          setManageLink(portalUrl);

          const { data: subscriptionStatus } =
            await hasSubscriptionQuery.refetch();
          setHasSubscription(subscriptionStatus ?? null);

          const { data: subscriptionTypeData } =
            await getSubscriptionTypeQuery.refetch();
          setSubscriptionType(subscriptionTypeData?.subType ?? null);

          const { data: waitlistStatus } = await isOnWaitlistQuery.refetch();
          setWaitlistButtonDisabled(waitlistStatus?.isOnWaitlist ?? false);
        } catch (error) {
          console.error("Error fetching billing link:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBillingLink();
  }, [isLoaded, user]);

  useEffect(() => {
    const endTime = new Date("2024-08-05T23:59:59").getTime();

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const timeDifference = endTime - now;
      setTimeLeft(timeDifference > 0 ? timeDifference : 0);
    };

    const intervalId = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleUpgrade = async () => {
    try {
      const { url: checkoutUrl } =
        await createCheckoutLinkMutation.mutateAsync();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout link:", error);
    }
  };

  const handleJoinWaitlist = async () => {
    try {
      await joinWaitlistMutation.mutateAsync();
      setWaitlistButtonDisabled(true);
      toast.success("You have successfully joined the waitlist!");
    } catch (error) {
      console.error("Error joining the waitlist:", error);
      toast.error("Failed to join the waitlist.");
    }
  };

  const formatTimeLeft = (time: number) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choose the plan that suits you best
          </p>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3
                    id={tier.id}
                    className="text-lg font-semibold leading-8 text-gray-900"
                  >
                    {tier.name}{" "}
                    {tier.name === "Default" && (
                      <span className="text-blue-500">
                        <span className="text-gray-500 line-through">
                          ${tier.originalPrice}
                        </span>{" "}
                        ${tier.discountedPrice}{" "}
                        <span className="text-sm text-gray-500">
                          billed annually
                        </span>
                      </span>
                    )}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {tier.description}
                </p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        aria-hidden="true"
                        className="h-6 w-5 flex-none text-blue-500"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {tier.name === "Default" ? (
                <button
                  onClick={handleUpgrade}
                  disabled={!!hasSubscription}
                  className={classNames(
                    "mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                    !!hasSubscription
                      ? "cursor-not-allowed bg-gray-200 text-gray-500"
                      : "bg-blue-500 text-white shadow-sm hover:bg-blue-400",
                  )}
                >
                  {!!hasSubscription ? "Current" : "Upgrade to Default"}
                </button>
              ) : (
                <button
                  onClick={handleJoinWaitlist}
                  disabled={isWaitlistButtonDisabled}
                  className="mt-8 block rounded-md bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm"
                >
                  {isWaitlistButtonDisabled
                    ? "Joined Waitlist"
                    : "Join Waitlist"}
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-center text-white">
          <p className="text-lg font-bold">
            The Default plan is currently discounted to $500. Normally $600.
          </p>
          <p className="mt-2">Time left: {formatTimeLeft(timeLeft)}</p>
        </div>
        <div className="mt-8 text-center">
          {manageLink && (
            <Link
              href={manageLink}
              className="inline-block rounded-md bg-blue-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-400"
            >
              Manage Billing
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
