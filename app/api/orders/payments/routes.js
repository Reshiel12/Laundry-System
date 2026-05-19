let customers = [];

export async function GET() {
  return Response.json(customers);
}

export async function POST(req) {
  const data = await req.json();
  const newCustomer = { id: Date.now(), name: data.name };
  customers.push(newCustomer);
  return Response.json(newCustomer);
}