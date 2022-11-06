import { FastifyInstance } from "fastify/types/instance";
import { string, z } from "zod";
import { prisma } from "../lib/prisma";
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get("/guesses/count", async () => {
    const count = await prisma.guess.count();
    return { count };
  });

  fastify.post(
    "/pools/:poolId/games/:gameId/guesses",
    { onRequest: [authenticate] },
    async (request, reply) => {
      const createGuessParams = z.object({
        poolId: z.string(),
        gameId: z.string(),
      });
      const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });
      const { poolId, gameId } = createGuessParams.parse(request.params);
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(
        request.body
      );

      const participant = await prisma.participant.findUnique({
        where: {
          userId_poolId: {
            poolId,
            userId: request.user.sub,
          },
        },
      });
      if (!participant) {
        return reply.status(400).send({
          message: "Você precisa se cadastrar no bolão para enviar palpites.",
        });
      }

      const guess = await prisma.guess.findUnique({
        where: {
          participantId_gameId: {
            participantId: participant.id,
            gameId,
          },
        },
      });
      if (guess) {
        return reply.status(400).send({
          message: "Você já enviou um palpite para esse jogo.",
        });
      }

      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });

      if (!game) {
        return reply.status(400).send({
          message: "Game not found",
        });
      }

      if (game.date < new Date()) {
        return reply.status(400).send({
          message:
            "Não é possível enviar palpites para jogos já iniciados/realizados",
        });
      }

      await prisma.guess.create({
        data: {
          participantId: participant.id,
          gameId: game.id,
          firstTeamPoints,
          secondTeamPoints,
        },
      });
      return reply.status(201).send();
    }
  );
}
