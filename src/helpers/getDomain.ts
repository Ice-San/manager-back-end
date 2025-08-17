const { 
    PORT, 
    RENDER_PUBLIC_DOMAIN, 
    RAILWAY_PUBLIC_DOMAIN,
    NEON_PUBLIC_DOMAIN
} = process.env;

const port = PORT || 3000;

type domain = {
    type: string,
    provider: string,
    url: string
}

const data: domain = {
    type: "public",
    provider: "",
    url: ""
};

export const getDomain = () => {
    const domain = NEON_PUBLIC_DOMAIN || RAILWAY_PUBLIC_DOMAIN || RENDER_PUBLIC_DOMAIN || "localhost";
    switch (domain) {
        case RAILWAY_PUBLIC_DOMAIN:
            data.type = "public";
            data.provider = "railway";
            data.url = `https://${RAILWAY_PUBLIC_DOMAIN}`;
            break;
        case RENDER_PUBLIC_DOMAIN:
            data.type = "public";
            data.provider = "render";
            data.url = `${RENDER_PUBLIC_DOMAIN}`;
            break;
        case NEON_PUBLIC_DOMAIN:
            data.type = "public";
            data.provider = "neon";
            data.url = `${NEON_PUBLIC_DOMAIN}`;
            break;
        default:
            data.type = "private";
            data.provider = "localhost";
            data.url = `http://localhost:${port}`;
            break;
    }

    return data;
}