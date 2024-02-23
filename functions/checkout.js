export async function onRequestGet(context) {
    // Parse the URL to get access to the query parameters
    const url = new URL(request.url);
    const number = url.searchParams.get('number');
    const ref = url.searchParams.get('ref');
    // Add CORS headers to the response
    const headers = new Headers({
        'Access-Control-Allow-Origin': '*', // Adjust this to be more restrictive if needed
        'Access-Control-Allow-Methods': 'GET',
        'Content-Type': 'application/json'

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
    const outboundUrl = new URL(context.env.PURCHASE_URL);
    outboundUrl.searchParams.set('customNumber', number);
    outboundUrl.searchParams.set('reference', ref);
    outboundUrl.searchParams.set('source', 'Create');
    outboundUrl.searchParams.set('action', 'purchase');
    outboundUrl.searchParams.set('delivery', 'SIM by post');
    outboundUrl.searchParams.set('website', url.href);

    try {
        // Fetch from the external API
        const response = await fetch(outboundUrl, { redirect: 'manual' });
        const location = response.headers.get('Location');

        if (location) {
            // Redirect to the URL provided by the external API
            return Response.redirect(location, 302);
        } else {
            // Handle case where the external API does not provide a redirect
            console.error('No redirect URL provided by the external API.');
            return new Response('No redirect URL provided.', { status: 400 });
        }
    } catch (error) {
        console.error('Error fetching the external API:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}