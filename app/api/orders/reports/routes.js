import { GET as getPayments } from "../payments/route.js"; // Reuse payments API

export async function GET() {

  // In a real project, you would fetch from DB.
  // Here, we simulate fetching payments from memory
  // We'll import payments array from payments API
  const payments = (await import("../payments/route.js")).payments || [];

  // Summarize total income
  const totalIncome = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  return Response.json({
    totalIncome,
    totalPayments: payments.length,
    payments
  });
}