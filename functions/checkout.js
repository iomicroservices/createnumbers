export async function onRequestGet({ request, env }) {
    const url = new URL(request.url);
    const number = url.searchParams.get('number');
    const ref = url.searchParams.get('ref');

    // Validation
    if (!number || !ref || number.length !== 11 || !number.startsWith('07') || ref.trim() === '') {
        // Construct response with CORS headers for failed validation
        return new Response('Invalid parameters', {
            status: 400,
            headers: {
                'Access-Control-Allow-Origin': '*', // Be more restrictive depending on your use case
                'Content-Type': 'application/json'
            }
        });
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
        const apiResponse = await fetch(outboundUrl.href, { redirect: 'manual' });
        const location = apiResponse.headers.get('Location');

        if (location) {
            // Redirect to the URL provided by the external API
            return Response.redirect(location, 302);
        } else {
            // Handle case where the external API does not provide a redirect
            console.error('No redirect URL provided by the external API.');
            return new Response('No redirect URL provided.', {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error('Error fetching the external API:', error);
        return new Response('Internal Server Error', {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        });
    }
}