// pages/api/auth/error.ts

import { NextApiRequest, NextApiResponse } from "next";

export default function errorHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { error } = req.query;
  res.status(400).json({ error });
}
