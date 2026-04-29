// Mock Stripe for semester project - no API key needed
export const stripe = {
  checkout: {
    sessions: {
      create: async (params) => {
        const sessionId = "mock_session_" + Date.now();
        return {
          id: sessionId,
          url: `${process.env.CLIENT_URL}/purchase-success?session_id=${sessionId}`,
          amount_total: params.line_items?.reduce(
            (sum, item) => sum + item.price_data.unit_amount * item.quantity, 0
          ) || 0,
          payment_status: "paid",
          metadata: params.metadata || {},
        };
      },
      retrieve: async (sessionId) => {
        // Parse the stored metadata from a global temp store
        const stored = global.__mockSessions?.[sessionId];
        return {
          id: sessionId,
          payment_status: "paid",
          amount_total: stored?.amount_total || 1000,
          metadata: stored?.metadata || {},
        };
      },
    },
  },
  coupons: {
    create: async ({ percent_off }) => ({
      id: "mock_coupon_" + percent_off + "_" + Date.now(),
    }),
  },
};