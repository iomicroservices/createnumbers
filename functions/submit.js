// Cloudflare Pages Function: submit.js
export async function onRequestPost(context) {
    // Extracting the incoming request
    const { request, env } = context;
    const formData = await request.formData();

    // Convert FormData to URLSearchParams for easy forwarding
    const body = new URLSearchParams(formData);

    // Forward the form data to the REQUEST_URL
    const response = await fetch(env.REQUEST_URL, {
        method: 'POST',
        body: body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    // Regardless of the response from REQUEST_URL, return a success message
    return new Response(JSON.stringify({ message: "Form submitted successfully." }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200, // HTTP Status Code for OK
    });
}