export const PLAN_LIMITS = {
    free: {
        portfolios: 2,
        strategies: 6
    },
    premium: {
        portfolios: 10,
        strategies: 50
    },
    pro: {
        portfolios: 20,
        strategies: 200
    }
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;
