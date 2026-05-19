let orders = [];

export async function GET() {
  return Response.json(orders);
}

export async function POST(req) {

  const data = await req.json();

  const newOrder = {
    id: Date.now(),
    customer: data.customer,
    service: data.service,
    payment: data.payment,
    status: "Pending"
  };

  orders.push(newOrder);

  return Response.json(newOrder);
}