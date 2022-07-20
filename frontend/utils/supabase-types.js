import "dotenv/config";
import openapiTS from "openapi-typescript";
import fs from "fs";
import path from "path";

// eslint-disable-next-line no-undef
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const outputPath = "./src/services/supabase-types.ts";

if (!supabaseKey) {
  console.error("Please set VITE_SUPABASE_ANON_KEY environment variable");
} else {
  loadTypes();
}

async function loadTypes() {
  const url = new URL("https://ngryplxakzlojeqhdkse.supabase.co/rest/v1/");
  url.searchParams.set("apikey", supabaseKey);

  const result = await openapiTS(url);

  const resolvedPath = path.resolve(outputPath);
  fs.writeFileSync(resolvedPath, result, "utf-8");
  console.log("Generated types successfully");
}
