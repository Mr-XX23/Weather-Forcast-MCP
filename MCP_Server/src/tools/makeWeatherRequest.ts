
import 'dotenv/config'

// local imports
import { AlertFeature } from "../types.js";

export async function makeNWSRequest<T>(url: string): Promise<T | null> {
    
    const headers = {
        "User-Agent": process.env.USER_AGENT || "MCP-Server/1.0",
        Accept: "application/geo+json",
    };

    try {
        const response = await fetch(url, { headers });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return (await response.json()) as T;
    } catch (error) {

        console.error("Error making NWS request:", error);
        return null;

    }
}

// Format alert data
export function formatAlert(feature: AlertFeature): string {
    const props = feature.properties;
    return [
        `Event: ${props.event || "Unknown"}`,
        `Area: ${props.areaDesc || "Unknown"}`,
        `Severity: ${props.severity || "Unknown"}`,
        `Status: ${props.status || "Unknown"}`,
        `Headline: ${props.headline || "No headline"}`,
        "---",
    ].join("\n");
}
