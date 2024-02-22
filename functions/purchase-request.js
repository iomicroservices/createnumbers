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
        const apiResponse = await fetch(outboundUrl.href);

        // Check if the API response wants to redirect
        if (apiResponse.status === 302 || apiResponse.status === 301) {
            // Get the URL to redirect to from the Location header
            const location = apiResponse.headers.get('Location');
            if (location) {
                // Redirect the user to the URL provided by the API
                return Response.redirect(location, 302);
            } else {
                throw new Error('Location header missing');
            }
        }

        // If the response is not a redirect, process as normal
        const responseData = await apiResponse.json();

        return new Response(JSON.stringify(responseData), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error:', error);
        return Response.redirect(`${ url.origin }`, 302);
    }
}