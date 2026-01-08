import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { readEnv } from './infrastructure/config/env.js';

async function main() {
  const env = readEnv(process.env);

  const bot = new Telegraf(env.BOT_TOKEN);

  bot.start(async (ctx) => {
    await ctx.reply('Привет! Это бот «Эмоциональный баланс». (каркас FEAT-PLT-01)');
  });

  bot.command('ping', async (ctx) => {
    await ctx.reply(`pong (${env.COMMIT_SHA})`);
  });

  await bot.launch();

  // Graceful shutdown
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

main().catch((err) => {
  // Важно: BOT_TOKEN обязателен — если его нет, падаем с понятной ошибкой (NS-1).
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
