export const COUPON_CODES = {
    VALENTINES: "LOVE",
    EASTER: "EASTER",
    HALLOWEEN: "HALLOWEEN",
} as const;


export type CouponCode = typeof COUPON_CODES[keyof typeof COUPON_CODES];