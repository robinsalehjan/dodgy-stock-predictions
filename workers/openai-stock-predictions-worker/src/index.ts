import OpenAI from 'openai';

export default {
	getCorsHeaders(origin: string) {
		const allowedOrigins: Array<string> = ['https://dodgy-stock-predictions.pages.dev'];

		return {
			'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : '',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		};
	},

	createOpenAIClient(env: Env) {
		return new OpenAI({
			apiKey: env.OPENAI_API_KEY,
			baseURL: 'https://gateway.ai.cloudflare.com/v1/119e6a647b254157e00e8dd335535eab/dodgy-stock-predictions/openai',
			defaultHeaders: {
				'cf-aig-authorization': `Bearer ${env.AUTH_OPENAI_STOCK_PREDICTIONS_WORKER}`
			}
		});
	},

	async handleChatCompletion(request: Request, env: Env) {
		const openai = this.createOpenAIClient(env);
		const messages = await request.json();

		const chatCompletion = await openai.chat.completions.create({
			model: 'gpt-4',
			messages,
			temperature: 1.1,
			presence_penalty: 0,
			frequency_penalty: 0
		});

		return chatCompletion.choices[0].message;
	},

	async fetch(request, env, ctx): Promise<Response> {
		const origin = request.headers.get('Origin') || '';
		const corsHeaders = this.getCorsHeaders(origin);

		// Handle CORS preflight requests
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: corsHeaders });
		}

		// Only process POST requests
		if (request.method !== 'POST') {
			return new Response(JSON.stringify({
				error: `${request.method} method not allowed.`
			}), {
				status: 405,
				headers: corsHeaders
			})
		}

		try {
			const response = await this.handleChatCompletion(request, env);
			return new Response(JSON.stringify(response), { headers: corsHeaders });
		} catch (e) {
			return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
		}
	},
} satisfies ExportedHandler<Env>;
