import path from "node:path";
import url from "node:url";
export default path.resolve(url.fileURLToPath(import.meta.url), "../dist/");
