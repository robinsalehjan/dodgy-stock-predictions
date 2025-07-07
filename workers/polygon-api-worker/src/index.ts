const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
};

export default {
	validateParameters(ticker: string | null, startDate: string | null, endDate: string | null) {
		return ticker && startDate && endDate;
	},

	buildPolygonURL(ticker: string, startDate: string, endDate: string) {
		return `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}`;
	},

	async fetchPolygonData(polygonURL: string, apiKey: string) {
		const response = await fetch(`${polygonURL}?apiKey=${apiKey}`);

		if (!response.ok) {
			throw new Error('Failed to fetch data from Polygon API.');
		}

		const data = await response.json();
		// Remove `request_id` for AI Gateway caching
		delete data.request_id;

		return data;
	},

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
		if (!this.validateParameters(ticker, startDate, endDate)) {
			return new Response("Missing required parameters", {
				status: 400,
				headers: corsHeaders,
			});
		}

		try {
			const polygonURL = this.buildPolygonURL(ticker!, startDate!, endDate!);
			const data = await this.fetchPolygonData(polygonURL, env.POLYGON_API_KEY);

			return new Response(JSON.stringify(data), { headers: corsHeaders });
		} catch (e) {
			return new Response(e.message, { status: 500, headers: corsHeaders });
		}
	},
};
