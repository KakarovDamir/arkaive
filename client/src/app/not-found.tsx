'use client'

export default function NotFound() {
    return (
        <html>
            <head>
                <style>
                    {`
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        font-family: Arial, sans-serif;
                        background-color: #f3f4f6;
                    }
                    .container {
                        text-align: center;
                        background: white;
                        padding: 40px;
                        border-radius: 10px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        font-size: 3em;
                        color: #ff6b6b;
                        margin-bottom: 10px;
                    }
                    p {
                        font-size: 1.2em;
                        color: #333;
                        margin-bottom: 20px;
                    }
                    a {
                        text-decoration: none;
                        color: #007bff;
                        font-size: 1em;
                        transition: color 0.3s;
                    }
                    a:hover {
                        color: #0056b3;
                    }
                    `}
                </style>
            </head>
            <body>
                <div className="container">
                    <h1>Something went wrong!</h1>
                    <p>We couldn&apos;t find the page you were looking for.</p>
                    <a href="/">Go back to the homepage</a>
                </div>
            </body>
        </html>
    );
}
