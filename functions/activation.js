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

    // Convert the FormData to a JSON object
    const formData = await request.formData();
    const json = {};
    formData.forEach((value, key) => { json[key] = value; });
    json['source'] = 'Create'; // Append the additional field

    // Forward the form data as JSON to the REQUEST_URL
    const response = await fetch(env.ACTIVATION_URL, {
        method: 'POST',
        body: JSON.stringify(json), // Convert the JSON object to a string
        headers: {
            'Content-Type': 'application/json', // Set Content-Type to application/json
        },
    });

    // Regardless of the response from REQUEST_URL, return a success message
    return new Response(JSON.stringify({ message: "Form submitted successfully." }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200, // HTTP Status Code for OK
    });
}
