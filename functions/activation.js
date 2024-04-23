export async function onRequestPost(context) {
    // Extracting the incoming request
    const { request, env } = context;

    // Check the Origin header of the request
    const origin = request.headers.get("Origin");
    const allowedOrigins = "https://createnumbers.com, https://www.createnumbers.com, https://createnumbers.co.uk, https://www.createnumbers.co.uk";

    // Return an error response if the origin is not as expected
    if (!allowedOrigins.includes(origin)) {
        return new Response("Unauthorized request", { status: 403 });
    }

    const formData = await request.formData();
    
    const jsonObject = {};
    for (const [key, value] of formData) {
      jsonObject[key] = value;
    }

    // Append additional fields to the JSON object
    jsonObject['source'] = 'Create';

    // Convert FormData to URLSearchParams for easy forwarding
    const body = new URLSearchParams(formData);

    // Forward the form data to the REQUEST_URL
    const response = await fetch(env.ACTIVATION_URL, {
        method: 'POST',
        body: JSON.stringify(jsonObject),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Regardless of the response from REQUEST_URL, return a success message
    return new Response(JSON.stringify({ message: "Form submitted successfully." }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200, // HTTP Status Code for OK
    });
}
