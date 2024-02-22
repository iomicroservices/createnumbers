export async function onRequestGet({ request, env }) {
    const url = new URL(request.url);
    const number = url.searchParams.get('number');
    const ref = url.searchParams.get('ref');

    if (!number || !ref || number.length !== 11 || !number.startsWith('07') || ref.trim() === '') {
        return Response.redirect(`${url.origin}/`, 302);
    }

    const outboundUrl = new URL(env.PURCHASE_URL);
    outboundUrl.searchParams.set('customNumber', number);
    outboundUrl.searchParams.set('reference', ref);
    outboundUrl.searchParams.set('source', 'Create');
    outboundUrl.searchParams.set('action', 'purchase');
    outboundUrl.searchParams.set('delivery', 'SIM by post');
    outboundUrl.searchParams.set('website', url.href);

    try {
        const apiResponse = await fetch(outboundUrl.href);

        // Redirect based on the API's response
        if (apiResponse.status === 302 || apiResponse.status === 301) {
            const location = apiResponse.headers.get('Location');
            if (location) {
                return Response.redirect(location, 302);
            }
        }

        // Check if the response is HTML to avoid parsing it as JSON
        const contentType = apiResponse.headers.get("Content-Type");
        if (contentType && contentType.includes("text/html")) {
            console.error("Expected JSON response, but got HTML.");
            return Response.redirect(`${url.origin}/`, 302);
        }

        // Process JSON response
        const responseData = await apiResponse.json();
        return new Response(JSON.stringify(responseData), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error:', error);
        return Response.redirect(`${url.origin}/`, 302);
    }
}
