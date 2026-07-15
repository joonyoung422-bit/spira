import OpenAI from 'openai';
import { BASE_SYSTEM, BUSINESS_PLANNING_SYSTEM, ROUTINE_SYSTEM } from '../../lib/ai/prompts';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { messages, planMode, routineMode, appContext } = await request.json();

  const baseSystem = planMode ? BUSINESS_PLANNING_SYSTEM : routineMode ? ROUTINE_SYSTEM : BASE_SYSTEM;
  const systemContent = appContext
    ? `${baseSystem}\n\n---\n현재 사용자의 앱 데이터 (질문에 이 데이터를 참고해서 구체적으로 답변하세요):\n${appContext}`
    : baseSystem;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const openaiStream = await client.chat.completions.create({
          model: 'gpt-4o',
          stream: true,
          messages: [
            { role: 'system', content: systemContent },
            ...messages,
          ],
        });

        for await (const chunk of openaiStream) {
          const text = chunk.choices[0]?.delta?.content ?? '';
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
