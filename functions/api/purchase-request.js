export async function onRequestGet({ request, env }) {
    // Parse the URL to get access to the query parameters
    const url = new URL(request.url);
    const number = url.searchParams.get('number');
    const ref = url.searchParams.get('ref');

    // Validation
    if (!number || !ref) {
        // Redirect to the root domain of the incoming request
        return Response.redirect(`${url.origin}/`, 302);
    }

    if (number.length !== 11 || !number.startsWith('07') || ref.trim() === '') {
        // Redirect to the root domain of the incoming request
        return Response.redirect(`${url.origin}/`, 302);
    }

    // Construct the outbound API URL with query parameters
    const outboundUrl = new URL(env.PURCHASE_URL);
    outboundUrl.searchParams.set('customNumber', number);
    outboundUrl.searchParams.set('reference', ref);
    outboundUrl.searchParams.set('source', 'Create');
    outboundUrl.searchParams.set('action', 'purchase');
    outboundUrl.searchParams.set('delivery', 'SIM by post');
    outboundUrl.searchParams.set('website', url.href);


    try {
        // Make the API call
        const apiResponse = await fetch(outboundUrl.href, {
            method: 'GET', // or 'POST', depending on your requirements
        });

        if (!apiResponse.ok) {
            throw new Error('API call failed');
        }

        // Process the API response
        const responseData = await apiResponse.json();
        // TODO: Do something with responseData

        // Return a success response or redirect based on your application logic
        return new Response(JSON.stringify(responseData), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        // Handle errors, potentially logging them or taking other actions
        return Response.redirect(env.HOMEPAGE_URL);
    }
}
