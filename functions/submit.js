export async function onRequest(context) {
    // Extract the environment variables
    const requestURL = context.env.REQUEST_URL;
    const requestToken = context.env.REQUEST_TOKEN;

    // Parse the incoming request body as JSON
    const originalRequestBody = await context.request.json();

    // Add the authenticity_token to the request body
    const modifiedRequestBody = {
        ...originalRequestBody,
        authenticity_token: requestToken,
    };

    // Prepare the fetch options
    const options = {
        method: 'POST', // Adjust if your external API requires a different method
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modifiedRequestBody),
    };

    // Forward the modified request to the external URL
    const response = await fetch(requestURL, options);

    // Stream the response back to the client
    return new Response(response.body, {
        status: response.status,
        headers: response.headers,
    });
}