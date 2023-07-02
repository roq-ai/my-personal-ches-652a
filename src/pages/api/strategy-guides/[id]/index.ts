import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { strategyGuideValidationSchema } from 'validationSchema/strategy-guides';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.strategy_guide
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getStrategyGuideById();
    case 'PUT':
      return updateStrategyGuideById();
    case 'DELETE':
      return deleteStrategyGuideById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getStrategyGuideById() {
    const data = await prisma.strategy_guide.findFirst(convertQueryToPrismaUtil(req.query, 'strategy_guide'));
    return res.status(200).json(data);
  }

  async function updateStrategyGuideById() {
    await strategyGuideValidationSchema.validate(req.body);
    const data = await prisma.strategy_guide.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteStrategyGuideById() {
    const data = await prisma.strategy_guide.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
