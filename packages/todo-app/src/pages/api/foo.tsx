import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(process.env.DATABASE_URL);
  res.status(200).json({ name: "John Doe" });
}
