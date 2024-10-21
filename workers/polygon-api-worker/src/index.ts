const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
};

export default {
	async fetch(request, env, ctx): Promise<Response> {
		// Handle CORS preflight requests
		if (request.method === "OPTIONS") {
			return new Response(null, { headers: corsHeaders });
		}

		// Parse the URL from the incoming request
		const url = new URL(request.url);

		// Extract the ticker and dates from the request URL
		const ticker = url.searchParams.get("ticker");
		const startDate = url.searchParams.get("startDate");
		const endDate = url.searchParams.get("endDate");

		// Ensure necessary parameters are present
		if (!ticker || !startDate || !endDate) {
			return new Response("Missing required parameters", {
				status: 400,
				headers: corsHeaders,
			});
		}

		// Construct the Polygon API URL
		const polygonURL = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}`;
		try {
			const polygonResponse = await fetch(
				`${polygonURL}?apiKey=${env.POLYGON_API_KEY}`
			);
			if (!polygonResponse.ok) {
				throw new Error('Failed to fetch data from Polygon API.');
			}
			// Parse response body as JSON and remove `request_id` for AI Gateway caching
			const data = await polygonResponse.json();
			delete data.request_id;

			return new Response(JSON.stringify(data), { headers: corsHeaders });
		} catch (e) {
			return new Response(e.message, { status: 500, headers: corsHeaders });
		}
	},
};
