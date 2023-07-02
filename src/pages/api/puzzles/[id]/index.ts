import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { puzzleValidationSchema } from 'validationSchema/puzzles';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.puzzle
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPuzzleById();
    case 'PUT':
      return updatePuzzleById();
    case 'DELETE':
      return deletePuzzleById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPuzzleById() {
    const data = await prisma.puzzle.findFirst(convertQueryToPrismaUtil(req.query, 'puzzle'));
    return res.status(200).json(data);
  }

  async function updatePuzzleById() {
    await puzzleValidationSchema.validate(req.body);
    const data = await prisma.puzzle.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePuzzleById() {
    const data = await prisma.puzzle.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
